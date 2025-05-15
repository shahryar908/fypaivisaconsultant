"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Loader2, X, Info, BookOpen, Briefcase, Globe, DollarSign, AlertCircle, CheckCircle2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// TypeScript interfaces
interface UserProfile {
  country: string
  education: string
  experience: number
  language: string
  finances: string
  age: number
  visaType: string
}

interface SuccessResponse {
  successProbability: number
  suggestions: string[]
  breakdown: { [key: string]: number }
}

// Mock data for development
const mockResponse: SuccessResponse = {
  successProbability: 75,
  suggestions: [
    "Complete a Master's degree to improve your education score",
    "Obtain TOEFL certification with a score of 100+ for better language assessment",
    "Gain 2 more years of relevant work experience in your field",
  ],
  breakdown: {
    education: 20,
    experience: 20,
    language: 15,
    finances: 20,
    age: 10,
    visaType: 5,
    country: 10,
  },
}

export default function VisaSuccessPredictionPage() {
  // State for form inputs
  const [profile, setProfile] = useState<UserProfile>({
    country: "",
    education: "",
    experience: 0,
    language: "",
    finances: "",
    age: 0,
    visaType: "",
  })

  // State for API response and UI state
  const [result, setResult] = useState<SuccessResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "none"
    message: string
  }>({ type: "none", message: "" })

  // Handle input changes
  const handleInputChange = (field: keyof UserProfile, value: string | number) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Show notification
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification({ type: "none", message: "" })
    }, 5000)
  }

  // Validation function
  const validateForm = (): boolean => {
    if (
      !profile.country ||
      !profile.education ||
      profile.experience === undefined ||
      !profile.language ||
      !profile.finances ||
      !profile.age ||
      !profile.visaType
    ) {
      showNotification("error", "Please fill in all required fields")
      return false
    }

    if (profile.experience < 0 || profile.experience > 30) {
      showNotification("error", "Work experience must be between 0 and 30 years")
      return false
    }

    if (profile.age < 18 || profile.age > 80) {
      showNotification("error", "Age must be between 18 and 80 years")
      return false
    }

    return true
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    try {
      // In a real app, this would be an API call
      // const response = await fetch('/predict-success', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(profile)
      // });

      // Simulate API call with setTimeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // if (!response.ok) throw new Error('Failed to calculate score');
      // const data = await response.json();

      // Use mock data
      setResult(mockResponse)
      setHasSubmitted(true)
      showNotification("success", "Score calculated successfully")

      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById("results-section")
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    } catch (error) {
      showNotification("error", "Failed to calculate score. Please try again.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Reset form
  const handleReset = () => {
    setProfile({
      country: "",
      education: "",
      experience: 0,
      language: "",
      finances: "",
      age: 0,
      visaType: "",
    })
    setResult(null)
    setHasSubmitted(false)
    setNotification({ type: "none", message: "" })
  }

  // Get color based on score
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  // Get progress bar color based on score
  const getProgressColor = (score: number): string => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  // Get icon for suggestion type
  const getSuggestionIcon = (suggestion: string) => {
    if (suggestion.toLowerCase().includes("degree") || suggestion.toLowerCase().includes("education")) {
      return <BookOpen className="w-5 h-5 text-primary" />
    }
    if (suggestion.toLowerCase().includes("experience") || suggestion.toLowerCase().includes("work")) {
      return <Briefcase className="w-5 h-5 text-primary" />
    }
    if (
      suggestion.toLowerCase().includes("language") ||
      suggestion.toLowerCase().includes("ielts") ||
      suggestion.toLowerCase().includes("toefl")
    ) {
      return <Globe className="w-5 h-5 text-primary" />
    }
    if (suggestion.toLowerCase().includes("financial") || suggestion.toLowerCase().includes("funds")) {
      return <DollarSign className="w-5 h-5 text-primary" />
    }
    return <Info className="w-5 h-5 text-primary" />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Main content */}
      <main className="container px-4 py-8 mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Visa Success Prediction</h1>
          <p className="mt-2 text-lg text-gray-600">Calculate your visa approval probability based on your profile</p>
          <h2 className="mt-4 text-xl font-semibold text-primary">Know Your Chances, Improve Your Odds</h2>
        </div>

        {/* Notification */}
        {notification.type !== "none" && (
          <Alert
            className={`mb-6 ${
              notification.type === "success"
                ? "bg-green-50 text-green-800 border-green-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            <div className="flex items-center">
              {notification.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              ) : (
                <AlertCircle className="h-4 w-4 mr-2" />
              )}
              <AlertTitle>{notification.type === "success" ? "Success" : "Error"}</AlertTitle>
            </div>
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        )}

        {/* Profile Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Enter your details to calculate visa success probability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="country">
                  Destination Country
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="inline w-4 h-4 ml-1 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>The country you are applying for a visa to</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select value={profile.country} onValueChange={(value) => handleInputChange("country", value)}>
                  <SelectTrigger id="country" aria-label="Select destination country">
                    <SelectValue placeholder="Select destination country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="New Zealand">New Zealand</SelectItem>
                    <SelectItem value="Singapore">Singapore</SelectItem>
                    <SelectItem value="Japan">Japan</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education Level</Label>
                <Select value={profile.education} onValueChange={(value) => handleInputChange("education", value)}>
                  <SelectTrigger id="education" aria-label="Select education level">
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High School">High School</SelectItem>
                    <SelectItem value="Bachelor's">Bachelor's</SelectItem>
                    <SelectItem value="Master's">Master's</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">
                  Work Experience (years)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="inline w-4 h-4 ml-1 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enter your total professional work experience in years (0-30)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  max="30"
                  placeholder="Enter years of experience"
                  value={profile.experience || ""}
                  onChange={(e) => handleInputChange("experience", Number.parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language Proficiency</Label>
                <Select value={profile.language} onValueChange={(value) => handleInputChange("language", value)}>
                  <SelectTrigger id="language" aria-label="Select language proficiency">
                    <SelectValue placeholder="Select language proficiency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IELTS 5.0">IELTS 5.0</SelectItem>
                    <SelectItem value="IELTS 5.5">IELTS 5.5</SelectItem>
                    <SelectItem value="IELTS 6.0">IELTS 6.0</SelectItem>
                    <SelectItem value="IELTS 6.5">IELTS 6.5</SelectItem>
                    <SelectItem value="IELTS 7.0+">IELTS 7.0+</SelectItem>
                    <SelectItem value="TOEFL 60-80">TOEFL 60-80</SelectItem>
                    <SelectItem value="TOEFL 80-100">TOEFL 80-100</SelectItem>
                    <SelectItem value="TOEFL 100+">TOEFL 100+</SelectItem>
                    <SelectItem value="German A1-A2">German A1-A2</SelectItem>
                    <SelectItem value="German B1-B2">German B1-B2</SelectItem>
                    <SelectItem value="German C1-C2">German C1-C2</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="finances">
                  Financial Status
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="inline w-4 h-4 ml-1 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your available funds for visa process and relocation</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select value={profile.finances} onValueChange={(value) => handleInputChange("finances", value)}>
                  <SelectTrigger id="finances" aria-label="Select financial status">
                    <SelectValue placeholder="Select financial status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low (Less than $5,000)</SelectItem>
                    <SelectItem value="Medium">Medium ($5,000 - $20,000)</SelectItem>
                    <SelectItem value="High">High (More than $20,000)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">
                  Age
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="inline w-4 h-4 ml-1 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your current age (18-80)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="age"
                  type="number"
                  min="18"
                  max="80"
                  placeholder="Enter your age"
                  value={profile.age || ""}
                  onChange={(e) => handleInputChange("age", Number.parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visaType">
                  Visa Type
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="inline w-4 h-4 ml-1 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>The type of visa you are applying for</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select value={profile.visaType} onValueChange={(value) => handleInputChange("visaType", value)}>
                  <SelectTrigger id="visaType" aria-label="Select visa type">
                    <SelectValue placeholder="Select visa type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student">Student Visa</SelectItem>
                    <SelectItem value="Work">Work Visa</SelectItem>
                    <SelectItem value="Tourist">Tourist Visa</SelectItem>
                    <SelectItem value="Family">Family Reunification</SelectItem>
                    <SelectItem value="Business">Business Visa</SelectItem>
                    <SelectItem value="Skilled Migration">Skilled Migration</SelectItem>
                    <SelectItem value="Investor">Investor Visa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleReset} disabled={isLoading}>
              <X className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Calculating...
                </>
              ) : (
                "Calculate Score"
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Results Section - Only shown after submission */}
        {hasSubmitted && result && (
          <div id="results-section" className="mt-8 space-y-8">
            <h2 className="text-2xl font-bold text-center">Your Results</h2>

            {/* Score Card */}
            <Card>
              <CardHeader>
                <CardTitle>Visa Success Probability</CardTitle>
                <CardDescription>Based on your profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Score Display */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-48 h-48 mx-auto mb-4 rounded-full border-8 border-gray-100 flex items-center justify-center">
                      <span className={`text-5xl font-bold ${getScoreColor(result.successProbability)}`}>
                        {result.successProbability}%
                      </span>
                    </div>
                    <div className="absolute -bottom-2 left-0 w-full">
                      <Progress
                        value={result.successProbability}
                        className={`h-2 ${getProgressColor(result.successProbability)}`}
                      />
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-500">
                    {result.successProbability >= 80 ? (
                      <span className="flex items-center justify-center text-green-600">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Excellent chances of visa approval
                      </span>
                    ) : result.successProbability >= 60 ? (
                      <span className="flex items-center justify-center text-yellow-600">
                        <Info className="w-4 h-4 mr-1" />
                        Good chances with some improvements
                      </span>
                    ) : (
                      <span className="flex items-center justify-center text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Needs significant improvements
                      </span>
                    )}
                  </p>
                </div>

                {/* Breakdown Dialog */}
                <div className="text-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        View Score Breakdown
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Score Breakdown</DialogTitle>
                        <DialogDescription>How different factors contribute to your overall score</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        {Object.entries(result.breakdown).map(([key, value]) => (
                          <div key={key} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium capitalize">{key}</span>
                              <span className="text-sm font-medium">{value}%</span>
                            </div>
                            <Progress value={value} max={30} className="h-2" />
                          </div>
                        ))}
                        <p className="text-xs text-gray-500 mt-4">
                          Note: Each factor has a maximum contribution of 25-30%. Improving low-scoring factors will
                          have the greatest impact.
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Improvement Suggestions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Improvement Suggestions</CardTitle>
                <CardDescription>Ways to increase your visa approval chances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.suggestions.map((suggestion, index) => (
                    <div key={index} className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                      <div className="flex">
                        <div className="flex-shrink-0 mr-3">{getSuggestionIcon(suggestion)}</div>
                        <p className="text-sm text-gray-700">{suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-3 bg-gray-50 border border-gray-100 rounded text-xs text-gray-500">
                  <p>
                    <strong>Disclaimer:</strong> This prediction is based on historical data and the information you
                    provided. Actual visa decisions depend on many factors including immigration policies, quotas, and
                    individual circumstances.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
