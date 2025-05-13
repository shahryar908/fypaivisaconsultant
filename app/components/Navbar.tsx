"use client"
import Link from "next/link"
import { Menu, Mountain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex h-20 w-full shrink-0 items-center bg-white/90 backdrop-blur-sm px-4 md:px-6 border-b border-slate-200 dark:border-slate-800 dark:bg-slate-950/90">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <Link href="/" className="flex items-center gap-2">
            <Mountain className="h-6 w-6" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300">
              Vizafy
            </span>
          </Link>
          <div className="grid gap-2 py-6">
            <Link href="/visainfo" className="flex w-full items-center py-2 text-lg font-semibold">
              Visa Information
            </Link>
            <Link href="/recommendation" className="flex w-full items-center py-2 text-lg font-semibold">
              Recommendation
            </Link>
            <Link href="/features" className="flex w-full items-center py-2 text-lg font-semibold">
              Features
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      <Link href="/" className="mr-6 flex items-center gap-2">
        <Mountain className="h-6 w-6" />
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300">
          Vizafy
        </span>
      </Link>

      <nav className="hidden lg:flex items-center space-x-8">
        <Link
          href="/visainfo"
          className="text-base font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
        >
          Visa Information
        </Link>
        <Link
          href="/chatbot"
          className="text-base font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
        >
          chatbot
        </Link>
        <Link
          href="/features"
          className="text-base font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
        >
          Features
        </Link>
      </nav>

      <div className="ml-auto flex gap-2">
        <SignedOut>
          <SignInButton mode="modal">
            <Button
              variant="outline"
              size="sm"
              className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
            >
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button
              size="sm"
              className="bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 text-white dark:from-slate-500 dark:to-slate-700"
            >
              Sign Up
            </Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox:
                  "w-9 h-9 border-2 border-slate-300 hover:border-slate-500 dark:border-slate-600 dark:hover:border-slate-400 rounded-full transition-colors",
              },
            }}
          />
        </SignedIn>
      </div>
    </header>
  )
}
