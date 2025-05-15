import { Card } from "@/components/ui/card"
import { Globe, Users, Lightbulb, Heart, CheckCircle, MessageSquareQuote } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <main className="container px-4 py-8 mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">About AI Visa Consultant</h1>
          <div className="mt-4 flex justify-center">
            <div className="w-20 h-1 bg-primary rounded"></div>
          </div>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <Globe className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-2xl font-bold">Our Mission: Your Journey, Simplified</h2>
          </div>
          <Card className="p-6">
            <p className="text-gray-700 leading-relaxed">
              At AI Visa Consultant, we believe that everyone deserves a chance to explore new horizons—whether it's
              studying abroad, advancing a career, or reuniting with loved ones. Our mission is to transform the complex
              world of visa applications into a seamless, empowering experience. Using cutting-edge artificial
              intelligence, we provide personalized guidance tailored to your unique dreams and circumstances, making
              global opportunities accessible to all.
            </p>
          </Card>
        </section>

        {/* Who We Are Section */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <Users className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-2xl font-bold">Who We Are</h2>
          </div>
          <Card className="p-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              We're a team of innovators, dreamers, and problem-solvers, united by a passion for breaking down barriers.
              Founded by Mehar Shahryar Khan and Zeeshan Asghar, two visionary students from the National University of
              Modern Languages, Islamabad, our project was born out of a desire to simplify the visa process for
              millions worldwide. Under the guidance of our dedicated faculty, we've blended technology with compassion
              to create a platform that's as human as it is intelligent.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our diverse team brings together expertise in software engineering, artificial intelligence, and global
              migration trends. We're not just building a tool—we're crafting a bridge to connect people with
              possibilities, no matter where they come from or where they're headed.
            </p>
          </Card>
        </section>

        {/* What We Do Section */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <Lightbulb className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-2xl font-bold">What We Do</h2>
          </div>
          <Card className="p-6">
            <p className="text-gray-700 leading-relaxed mb-6">
              Navigating visa applications can feel like wandering through a maze. That's where we come in. AI Visa
              Consultant is your trusted companion, offering:
            </p>

            <ul className="space-y-4 mb-6">
              <li className="flex">
                <div className="mr-3 mt-1">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Personalized Recommendations</p>
                  <p className="text-gray-600">
                    Discover the best countries for your study, work, or immigration goals, tailored to your skills,
                    finances, and aspirations.
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="mr-3 mt-1">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Smart Insights</p>
                  <p className="text-gray-600">
                    From visa success predictions to job market trends, our AI delivers clear, actionable advice to
                    boost your chances.
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="mr-3 mt-1">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-800">24/7 Support</p>
                  <p className="text-gray-600">
                    Our friendly chatbot is always ready to answer your questions, ensuring you're never alone on your
                    journey.
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="mr-3 mt-1">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Affordable Access</p>
                  <p className="text-gray-600">
                    Expert guidance without the hefty price tag, because opportunity shouldn't come with a barrier.
                  </p>
                </div>
              </li>
            </ul>

            <p className="text-gray-700 leading-relaxed">
              Whether you're a student chasing a degree, a professional seeking new horizons, or a family dreaming of a
              fresh start, we're here to light the way.
            </p>
          </Card>
        </section>

        {/* Our Vision Section */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <Heart className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-2xl font-bold">Our Vision</h2>
          </div>
          <Card className="p-6">
            <p className="text-gray-700 leading-relaxed">
              We envision a world where borders don't limit dreams. By harnessing AI, we aim to democratize access to
              global opportunities, empowering individuals from every corner of the globe. We're committed to supporting
              the United Nations' Sustainable Development Goals, including Quality Education (SDG 4), Decent Work and
              Economic Growth (SDG 8), and Reduced Inequalities (SDG 10). Together, we're building a future where
              everyone can thrive, no matter their background.
            </p>
          </Card>
        </section>

        {/* Why Choose Us Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Inclusive by Design</h3>
              <p className="text-gray-600">
                Our platform is built for everyone, with intuitive features and multilingual support (coming soon!) to
                ensure no one is left behind.
              </p>
            </Card>

            <Card className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Trustworthy Guidance</h3>
              <p className="text-gray-600">
                Backed by up-to-date data and AI-driven insights, we provide reliable advice you can count on.
              </p>
            </Card>

            <Card className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Community-Driven</h3>
              <p className="text-gray-600">
                Your feedback shapes our platform, helping us grow to serve you better every day.
              </p>
            </Card>
          </div>
        </section>

        {/* Founders Note Section */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <MessageSquareQuote className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-2xl font-bold">A Note from Our Founders</h2>
          </div>
          <Card className="p-6">
            <blockquote className="border-l-4 border-primary pl-4 italic text-gray-700 leading-relaxed">
              "We started AI Visa Consultant because we saw how daunting the visa process can be. Our goal is to make it
              feel less like a challenge and more like an adventure. With every recommendation, we're not just
              suggesting a country—we're helping you take a step toward your dreams."
            </blockquote>
            <p className="text-right mt-4 font-medium">— Mehar Shahryar Khan & Zeeshan Asghar</p>
          </Card>
        </section>

        {/* Call to Action Section */}
        <section className="mb-8">
          <Card className="p-8 bg-primary/5 border-primary/20">
            <h2 className="text-2xl font-bold mb-4 text-center">Join Us on the Journey</h2>
            <p className="text-gray-700 leading-relaxed mb-6 text-center">
              Ready to explore the world with confidence? AI Visa Consultant is here to guide you every step of the way.
              Let's turn your aspirations into reality, one visa at a time.
            </p>
            <p className="text-gray-700 leading-relaxed text-center">
              Connect with us at the National University of Modern Languages, Islamabad, or reach out through our
              Contact page. Your story matters, and we can't wait to be part of it.
            </p>
          </Card>
        </section>
      </main>
    </div>
  )
}
