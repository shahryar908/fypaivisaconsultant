"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { Send, Loader2, Sparkles, MoreHorizontal, Paperclip, X, Download, Copy, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/hooks/use-toast"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

type Message = {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
  status?: "sending" | "sent" | "error"
}

interface ChatInterfaceProps {
  initialMessages?: Message[]
  userAvatar?: string
  assistantAvatar?: string
  assistantName?: string
  onSendMessage?: (message: string) => Promise<string>
  getAuthToken?: () => Promise<string>
  apiEndpoint?: string
  placeholder?: string
  className?: string
}

export default function ChatInterface({
  initialMessages = [],
  userAvatar = "/placeholder.svg?height=40&width=40",
  assistantAvatar = "/placeholder.svg?height=40&width=40",
  assistantName = "AI Assistant",
  onSendMessage,
  getAuthToken,
  apiEndpoint = "/api/chat/message",
  placeholder = "Type your message...",
  className = "",
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(
    initialMessages.length > 0
      ? initialMessages
      : [
          {
            id: uuidv4(),
            content: `Hello! I'm ${assistantName}. How can I help you today?`,
            sender: "assistant",
            timestamp: new Date(),
          },
        ],
  )
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState(uuidv4())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isInitialState, setIsInitialState] = useState(messages.length <= 1)

  useEffect(() => {
    // Focus the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
    setIsInitialState(messages.length <= 1)
  }, [messages])

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: uuidv4(),
      content: input,
      sender: "user",
      timestamp: new Date(),
      status: "sending",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      let response: string

      // If custom onSendMessage handler is provided, use it
      if (onSendMessage) {
        response = await onSendMessage(input)
      } else {
        // Otherwise use the default implementation with fetch
        const token = getAuthToken ? await getAuthToken() : null

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        }

        if (token) {
          headers["Authorization"] = `Bearer ${token}`
        }

        const res = await fetch(apiEndpoint, {
          method: "POST",
          headers,
          body: JSON.stringify({
            message: input,
            sessionId,
          }),
        })

        if (!res.ok) {
          throw new Error(`Error: ${res.status}`)
        }

        const data = await res.json()

        // Save the session ID for future messages
        if (data.sessionId) {
          setSessionId(data.sessionId)
        }

        response = data.response
      }

      // Update user message status to sent
      setMessages((prev) => prev.map((msg) => (msg.id === userMessage.id ? { ...msg, status: "sent" as const } : msg)))

      const assistantMessage: Message = {
        id: uuidv4(),
        content: response,
        sender: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)

      // Update user message status to error
      setMessages((prev) => prev.map((msg) => (msg.id === userMessage.id ? { ...msg, status: "error" as const } : msg)))

      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        content: "Sorry, there was an error processing your request. Please try again.",
        sender: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      // Focus the input field after sending a message
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const clearConversation = () => {
    setMessages([
      {
        id: uuidv4(),
        content: `Hello! I'm ${assistantName}. How can I help you today?`,
        sender: "assistant",
        timestamp: new Date(),
      },
    ])
    setSessionId(uuidv4())
    toast({
      title: "Conversation cleared",
      description: "Your conversation has been reset.",
    })
  }

  const copyConversation = () => {
    const conversationText = messages
      .map((msg) => `${msg.sender === "user" ? "You" : assistantName}: ${msg.content}`)
      .join("\n\n")

    navigator.clipboard.writeText(conversationText)
    toast({
      title: "Copied to clipboard",
      description: "The conversation has been copied to your clipboard.",
    })
  }

  const exportConversation = () => {
    const conversationText = messages
      .map((msg) => `${msg.sender === "user" ? "You" : assistantName}: ${msg.content}`)
      .join("\n\n")

    const blob = new Blob([conversationText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chat-export-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Conversation exported",
      description: "Your conversation has been exported as a text file.",
    })
  }

  return (
    <div
      className={`flex flex-col h-[calc(100vh-80px)] md:h-[700px] max-w-4xl mx-auto rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-950 ${className}`}
    >
      {/* Chat Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8 border border-primary/10">
                <AvatarImage src={assistantAvatar || "/placeholder.svg"} alt={assistantName} />
                <AvatarFallback>{assistantName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-sm font-semibold">{assistantName}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => {
                      toast({
                        title: "Feature coming soon",
                        description: "This feature will be available in a future update.",
                      })
                    }}
                  >
                    <Sparkles className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>AI Features</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={clearConversation}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear conversation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={copyConversation}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to clipboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportConversation}>
                  <Download className="mr-2 h-4 w-4" />
                  Export conversation
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    toast({
                      title: "Settings",
                      description: "Settings panel will be available in a future update.",
                    })
                  }}
                >
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className={`flex-1 flex flex-col ${isInitialState ? "justify-center" : ""}`}>
        {!isInitialState && (
          <ScrollArea className="flex-1 p-4 overflow-y-auto" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex max-w-[85%] ${
                      message.sender === "user" ? "flex-row-reverse" : "flex-row"
                    } items-start gap-2`}
                  >
                    <Avatar
                      className={`h-8 w-8 ${message.sender === "user" ? "border-primary/20" : "border-gray-200 dark:border-gray-700"} border flex-shrink-0`}
                    >
                      {message.sender === "assistant" ? (
                        <>
                          <AvatarImage src={assistantAvatar || "/placeholder.svg"} alt={assistantName} />
                          <AvatarFallback>{assistantName.charAt(0)}</AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarImage src={userAvatar || "/placeholder.svg"} alt="You" />
                          <AvatarFallback>You</AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      {message.sender === "assistant" ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || "")
                                return !inline && match ? (
                                  <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                                    {String(children).replace(/\n$/, "")}
                                  </SyntaxHighlighter>
                                ) : (
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                )
                              },
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className="relative">
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          {message.status === "sending" && (
                            <div className="absolute top-0 right-0 -mt-2 -mr-2">
                              <Loader2 className="h-3 w-3 animate-spin text-primary-foreground/70" />
                            </div>
                          )}
                          {message.status === "error" && (
                            <div className="absolute top-0 right-0 -mt-2 -mr-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <X className="h-3 w-3 text-red-500" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Failed to send message</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          )}
                        </div>
                      )}
                      <p className="text-xs mt-1 opacity-70 text-right">{formatMessageTime(message.timestamp)}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}

        {isInitialState && (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center max-w-md">
              <Avatar className="h-16 w-16 mx-auto mb-4 border border-primary/10">
                <AvatarImage src={assistantAvatar || "/placeholder.svg"} alt={assistantName} />
                <AvatarFallback>{assistantName.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold mb-2">{assistantName}</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                I'm here to help answer your questions and assist with your tasks. How can I help you today?
              </p>
              <div className="flex justify-center">
                {["How does this work?", "What can you do?", "Tell me a joke"].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    className="mx-1 text-xs"
                    onClick={() => {
                      setInput(suggestion)
                      if (inputRef.current) {
                        inputRef.current.focus()
                      }
                    }}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 sticky bottom-0 left-0 right-0">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => {
                    toast({
                      title: "Attachments",
                      description: "File attachment feature will be available soon.",
                    })
                  }}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Attach files</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 rounded-full bg-gray-100 dark:bg-gray-800 border-0 focus-visible:ring-1 focus-visible:ring-primary"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage(e)
              }
            }}
          />

          <Button
            type="submit"
            size="icon"
            className="rounded-full"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  )
}
