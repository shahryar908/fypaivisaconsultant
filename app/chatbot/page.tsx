"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Copy, RefreshCw, Loader2, Sun, Moon, MessageSquare, X } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  status?: "sending" | "sent" | "error"
}

// Define API response type
interface ChatResponse {
  response: string
  sessionId: string
  userId?: string
  userEmail?: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  // Load session ID from localStorage on component mount
  useEffect(() => {
    const savedSessionId = localStorage.getItem("chatSessionId")
    if (savedSessionId) {
      setSessionId(savedSessionId)
    }
  }, [])

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    const messageId = Date.now().toString()

    // Add user message
    const userMessage: Message = {
      id: messageId,
      content: input,
      role: "user",
      timestamp: new Date(),
      status: "sending",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Make API call to backend
      const response = await fetch("http://localhost:5000/api/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          sessionId: sessionId || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data: ChatResponse = await response.json()

      // Save the session ID for future messages
      if (data.sessionId) {
        setSessionId(data.sessionId)
        localStorage.setItem("chatSessionId", data.sessionId)
      }

      // Update user message status
      setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, status: "sent" } : msg)))

      // Add assistant message
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: data.response,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)

      // Update message status to error
      setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, status: "error" } : msg)))

      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      // Focus input after sending
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  const retryMessage = async (messageId: string) => {
    const messageToRetry = messages.find((msg) => msg.id === messageId)
    if (!messageToRetry) return

    // Update message status
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, status: "sending" } : msg)))

    setIsLoading(true)

    try {
      // Make API call to backend
      const response = await fetch("http://localhost:5000/api/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToRetry.content,
          sessionId: sessionId || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data: ChatResponse = await response.json()

      // Save the session ID for future messages
      if (data.sessionId) {
        setSessionId(data.sessionId)
        localStorage.setItem("chatSessionId", data.sessionId)
      }

      // Update message status
      setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, status: "sent" } : msg)))

      // Add assistant message
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: data.response,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error retrying message:", error)

      // Update message status to error
      setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, status: "error" } : msg)))

      toast({
        title: "Error",
        description: "Failed to retry message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Copied!",
      description: "Message copied to clipboard",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const clearChat = () => {
    setMessages([])
    // Don't clear the sessionId to maintain the conversation context on the server
    toast({
      title: "Chat cleared",
      description: "All messages have been removed from this view",
    })
  }

  // Custom renderer for code blocks in markdown
  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <SyntaxHighlighter
          style={atomDark}
          language={match[1]}
          PreTag="div"
          className="rounded-md my-4"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={`${className} bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-sm`} {...props}>
          {children}
        </code>
      )
    },
    // Style other markdown elements
    p({ node, children }: any) {
      return <p className="mb-4 last:mb-0">{children}</p>
    },
    h1({ node, children }: any) {
      return <h1 className="text-2xl font-bold my-4">{children}</h1>
    },
    h2({ node, children }: any) {
      return <h2 className="text-xl font-bold my-3">{children}</h2>
    },
    h3({ node, children }: any) {
      return <h3 className="text-lg font-bold my-2">{children}</h3>
    },
    ul({ node, children }: any) {
      return <ul className="list-disc pl-6 mb-4">{children}</ul>
    },
    ol({ node, children }: any) {
      return <ol className="list-decimal pl-6 mb-4">{children}</ol>
    },
    li({ node, children }: any) {
      return <li className="mb-1">{children}</li>
    },
    blockquote({ node, children }: any) {
      return <blockquote className="border-l-4 border-slate-300 dark:border-slate-600 pl-4 italic my-4">{children}</blockquote>
    },
    a({ node, children, href, ...props }: any) {
      return <a href={href} className="text-blue-600 dark:text-blue-400 hover:underline" {...props}>{children}</a>
    },
    table({ node, children }: any) {
      return <table className="border-collapse table-auto w-full my-4">{children}</table>
    },
    thead({ node, children }: any) {
      return <thead className="bg-slate-100 dark:bg-slate-800">{children}</thead>
    },
    tbody({ node, children }: any) {
      return <tbody>{children}</tbody>
    },
    tr({ node, children }: any) {
      return <tr>{children}</tr>
    },
    th({ node, children }: any) {
      return <th className="border border-slate-300 dark:border-slate-700 p-2 text-left">{children}</th>
    },
    td({ node, children }: any) {
      return <td className="border border-slate-300 dark:border-slate-700 p-2">{children}</td>
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300">
            AI Chat Assistant
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Ask questions, get information, and explore ideas with our AI assistant
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg overflow-hidden mb-0">
            {/* Chat header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 text-white p-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="mr-3 p-1.5 rounded-full bg-white/10 text-white">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold">Chat Session</h2>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="text-white hover:bg-white/10"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearChat}
                  className="text-white hover:bg-white/10"
                  aria-label="Clear chat"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Chat messages */}
            <CardContent className="p-0">
              <div ref={chatContainerRef} className="h-[500px] overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-center max-w-md"
                    >
                      <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <MessageSquare className="h-8 w-8 text-slate-400" />
                      </div>
                      <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Ask me anything</h2>
                      <p className="text-slate-500 dark:text-slate-400 mb-6">
                        I'm your AI assistant, ready to help with information, creative tasks, and more.
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {["How does this work?", "Tell me a joke", "What can you do?"].map((suggestion) => (
                          <Button
                            key={suggestion}
                            variant="outline"
                            size="sm"
                            onClick={() => setInput(suggestion)}
                            className="text-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`group relative ${message.role === "user" ? "max-w-[80%]" : "max-w-[85%]"} rounded-lg p-4 ${
                              message.role === "user"
                                ? "bg-gradient-to-r from-slate-800 to-slate-700 text-white"
                                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            {/* Message content - User messages stay as is, Assistant messages use Markdown */}
                            {message.role === "user" ? (
                              <div className="whitespace-pre-wrap">{message.content}</div>
                            ) : (
                              <div className="prose dark:prose-invert prose-sm max-w-none">
                                <ReactMarkdown components={MarkdownComponents}>
                                  {message.content}
                                </ReactMarkdown>
                              </div>
                            )}

                            {/* Message status indicators */}
                            {message.role === "user" && message.status === "sending" && (
                              <div className="absolute -bottom-1 -right-1">
                                <Loader2 className="h-3 w-3 animate-spin text-white" />
                              </div>
                            )}

                            {message.role === "user" && message.status === "error" && (
                              <div className="absolute -bottom-6 right-0">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2 text-xs text-red-500 dark:text-red-400"
                                  onClick={() => retryMessage(message.id)}
                                >
                                  <RefreshCw className="h-3 w-3 mr-1" />
                                  Retry
                                </Button>
                              </div>
                            )}

                            {/* Copy button for assistant messages */}
                            {message.role === "assistant" && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => copyToClipboard(message.content)}
                              >
                                <Copy className="h-3 w-3" />
                                <span className="sr-only">Copy to clipboard</span>
                              </Button>
                            )}

                            {/* Timestamp */}
                            <div
                              className={`text-xs mt-1 text-right ${
                                message.role === "user" ? "text-white/70" : "text-slate-500 dark:text-slate-400"
                              }`}
                            >
                              {formatTime(message.timestamp)}
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      {/* Typing animation */}
                      {isLoading && messages.length > 0 && messages[messages.length - 1].role === "user" && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center space-x-2 p-3 max-w-fit rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                        >
                          <div className="flex space-x-1">
                            <div
                              className="w-2 h-2 rounded-full bg-slate-500 dark:bg-slate-400 animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            />
                            <div
                              className="w-2 h-2 rounded-full bg-slate-500 dark:bg-slate-400 animate-bounce"
                              style={{ animationDelay: "200ms" }}
                            />
                            <div
                              className="w-2 h-2 rounded-full bg-slate-500 dark:bg-slate-400 animate-bounce"
                              style={{ animationDelay: "400ms" }}
                            />
                          </div>
                          <span className="text-sm text-slate-500 dark:text-slate-400">AI is thinking...</span>
                        </motion.div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  </AnimatePresence>
                )}
              </div>

              {/* Input area - Always visible and sticky */}
              <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-950 sticky bottom-0 left-0 right-0 z-10">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="h-12 px-6 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}