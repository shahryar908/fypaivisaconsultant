import Link from "next/link"
import { ArrowRight, Globe, Search, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
   

      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-slate-900 dark:text-white">
              Your Visa Journey{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400">
                Simplified
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
              One place for all your visa requirements. No more confusion, just clarity.
            </p>
            <Link href="/visainfo">
              <Button
                size="lg"
                className="bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 h-14 px-8 text-lg rounded-full"
              >
                Find Your Visa Requirements
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6">
                  <Search className="h-8 w-8 text-slate-700 dark:text-slate-300" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Find Instantly</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Search visa requirements for any country in seconds, not hours.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6">
                  <MapPin className="h-8 w-8 text-slate-700 dark:text-slate-300" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Global Coverage</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Comprehensive information for countries worldwide, all in one place.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-8 w-8 text-slate-700 dark:text-slate-300" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Always Updated</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Current processing times and requirements, so you're never caught off guard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial/Quote Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-2xl md:text-3xl font-light italic text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
              "Planning international travel shouldn't mean drowning in visa paperwork. We've simplified the process so
              you can focus on your journey, not the bureaucracy."
            </p>
            <div className="w-20 h-1 bg-slate-300 dark:bg-slate-700 mx-auto"></div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to simplify your visa process?</h2>
          <p className="text-xl text-slate-200 mb-10 max-w-2xl mx-auto">
            Join thousands of travelers who've made visa research effortless.
          </p>
          <Link href="/portal">
            <Button size="lg" className="bg-white text-slate-800 hover:bg-slate-100 h-14 px-10 text-lg rounded-full">
              Start Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Globe className="h-6 w-6 text-slate-800 dark:text-slate-200" />
              <span className="font-bold text-xl text-slate-900 dark:text-white">VisaPortal</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-center md:text-right">
              &copy; {new Date().getFullYear()} VisaPortal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
