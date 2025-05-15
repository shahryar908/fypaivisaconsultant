"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowUpDown, Flag, Globe, X, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"



// TypeScript interfaces
interface UserProfile {
  nationality: string
  education: string
  field: string
  experience: number
  language: string
  financialAssets: number
  annualIncome: number
  visaType: string
  age?: number
  preferredRegion?: string[]
  maritalStatus?: string
  dependents?: number
  criminalRecord?: string
  healthStatus?: string
  previousRejections?: string
}

interface Recommendation {
  country: string
  visaTypes: string[]
  approvalLikelihood: number
  rationale: string
}

// Mock country data for development
const mockRecommendations: Recommendation[] = [
  {
    country: "Canada",
    visaTypes: ["Study", "Work", "Immigration"],
    approvalLikelihood: 88,
    rationale: "High demand for IT professionals, Express Entry eligibility, and favorable immigration policies",
  },
  {
    country: "Australia",
    visaTypes: ["Study", "Work", "Immigration"],
    approvalLikelihood: 82,
    rationale: "Strong education system, skilled migration program, and high demand for healthcare professionals",
  },
  {
    country: "Germany",
    visaTypes: ["Study", "Work"],
    approvalLikelihood: 78,
    rationale: "Free education, Blue Card for skilled professionals, and strong economy with need for engineers",
  },
  {
    country: "United Kingdom",
    visaTypes: ["Study", "Work"],
    approvalLikelihood: 75,
    rationale: "World-class universities, post-study work opportunities, and demand for tech professionals",
  },
  {
    country: "New Zealand",
    visaTypes: ["Work", "Immigration"],
    approvalLikelihood: 72,
    rationale: "Quality of life, straightforward immigration process, and family-friendly policies",
  },
  {
    country: "Singapore",
    visaTypes: ["Work"],
    approvalLikelihood: 68,
    rationale: "Strong economy, demand for finance and tech professionals, and proximity to Asian markets",
  },
  {
    country: "United States",
    visaTypes: ["Study", "Work"],
    approvalLikelihood: 65,
    rationale: "Prestigious universities, H-1B visa opportunities, but stricter immigration policies",
  },
  {
    country: "Ireland",
    visaTypes: ["Study", "Work"],
    approvalLikelihood: 70,
    rationale: "EU access, tech hub, English-speaking environment, and post-study work options",
  },
]

export default function CountryRecommendationPage() {
  // State for form inputs
  const [profile, setProfile] = useState<UserProfile>({
    nationality: "",
    education: "",
    field: "",
    experience: 0,
    language: "",
    financialAssets: 0,
    annualIncome: 0,
    visaType: "",
    age: undefined,
    preferredRegion: [],
    maritalStatus: "",
    dependents: 0,
    criminalRecord: "",
    healthStatus: "",
    previousRejections: "",
  })

  // State for recommendations and UI state
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState<"likelihood" | "country">("likelihood")
  const [currentPage, setCurrentPage] = useState(1)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  

  // Items per page for pagination
  const itemsPerPage = 5

  // Handle input changes
  const handleInputChange = (field: keyof UserProfile, value: string | number | string[] | undefined) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Validation function
  const validateForm = (): boolean => {
    if (
      !profile.nationality ||
      !profile.education ||
      !profile.field ||
      profile.experience === undefined ||
      !profile.language ||
      profile.financialAssets === undefined ||
      profile.annualIncome === undefined ||
      !profile.visaType
    ) {
      return false
    }
    return true
  }

  // Handle form submission
  const handleSubmit = async () => {
  if (!validateForm()) return;

  setIsLoading(true);

  try {
    // Simulate API call with setTimeout
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Use mock data
    const sortedData = [...mockRecommendations].sort((a, b) => b.approvalLikelihood - a.approvalLikelihood);

    setRecommendations(sortedData);
    setHasSubmitted(true);
    setCurrentPage(1);
  } catch (error) {
    // Log a meaningful error message if something goes wrong
    console.error("Failed to process recommendations:", error);
  } finally {
    setIsLoading(false);
  }
};

  // Reset form
  const handleReset = () => {
    setProfile({
      nationality: "",
      education: "",
      field: "",
      experience: 0,
      language: "",
      financialAssets: 0,
      annualIncome: 0,
      visaType: "",
      age: undefined,
      preferredRegion: [],
      maritalStatus: "",
      dependents: 0,
      criminalRecord: "",
      healthStatus: "",
      previousRejections: "",
    })
    setRecommendations([])
    setHasSubmitted(false)
  }

  // Handle sorting
  const handleSort = () => {
    const newSortOrder = sortOrder === "likelihood" ? "country" : "likelihood"
    setSortOrder(newSortOrder)

    setRecommendations((prev) => {
      const sorted = [...prev]
      if (newSortOrder === "likelihood") {
        sorted.sort((a, b) => b.approvalLikelihood - a.approvalLikelihood)
      } else {
        sorted.sort((a, b) => a.country.localeCompare(b.country))
      }
      return sorted
    })
  }

  // Calculate pagination
  const totalPages = Math.ceil(recommendations.length / itemsPerPage)
  const paginatedRecommendations = recommendations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Render likelihood badge with appropriate color
  const renderLikelihoodBadge = (likelihood: number) => {
    let color = "bg-red-100 text-red-800"

    if (likelihood >= 70) {
      color = "bg-green-100 text-green-800"
    } else if (likelihood >= 50) {
      color = "bg-yellow-100 text-yellow-800"
    }

    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>{likelihood}% Approval</span>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Main content */}
      <main className="container px-4 py-8 mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Country Recommendation System</h1>
          <p className="mt-2 text-lg text-gray-600">Get personalized visa recommendations based on your profile</p>
          <h2 className="mt-4 text-xl font-semibold text-primary">Your Gateway to Global Opportunities</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Profile Form */}
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Enter your details to get visa recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Required Fields Section */}
              <div className="mb-6">
                <h3 className="mb-4 text-sm font-medium text-gray-500 uppercase">Required Information</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Select
                      value={profile.nationality}
                      onValueChange={(value) => handleInputChange("nationality", value)}
                    >
                      <SelectTrigger id="nationality" aria-label="Select nationality">
                        <SelectValue placeholder="Select your nationality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="Pakistan">Pakistan</SelectItem>
                        <SelectItem value="Nigeria">Nigeria</SelectItem>
                        <SelectItem value="China">China</SelectItem>
                        <SelectItem value="Brazil">Brazil</SelectItem>
                        <SelectItem value="Philippines">Philippines</SelectItem>
                        <SelectItem value="Mexico">Mexico</SelectItem>
                        <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                        <SelectItem value="Egypt">Egypt</SelectItem>
                        <SelectItem value="Vietnam">Vietnam</SelectItem>
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
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="High School">High School</SelectItem>
                        <SelectItem value="Diploma">Diploma</SelectItem>
                        <SelectItem value="Bachelor's">Bachelor's</SelectItem>
                        <SelectItem value="Master's">Master's</SelectItem>
                        <SelectItem value="PhD">PhD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="field">Field of Study/Profession</Label>
                    <Select value={profile.field} onValueChange={(value) => handleInputChange("field", value)}>
                      <SelectTrigger id="field" aria-label="Select field of study or profession">
                        <SelectValue placeholder="Select your field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Business Administration">Business Administration</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Arts & Humanities">Arts & Humanities</SelectItem>
                        <SelectItem value="Natural Sciences">Natural Sciences</SelectItem>
                        <SelectItem value="Social Sciences">Social Sciences</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
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
                            <p>Enter your total professional work experience in years</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      id="experience"
                      type="number"
                      min="0"
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
                        <SelectItem value="IELTS 6.5">IELTS 6.5</SelectItem>
                        <SelectItem value="IELTS 7.0+">IELTS 7.0+</SelectItem>
                        <SelectItem value="TOEFL 60-80">TOEFL 60-80</SelectItem>
                        <SelectItem value="TOEFL 80-100">TOEFL 80-100</SelectItem>
                        <SelectItem value="TOEFL 100+">TOEFL 100+</SelectItem>
                        <SelectItem value="German A1-A2">German A1-A2</SelectItem>
                        <SelectItem value="German B1-B2">German B1-B2</SelectItem>
                        <SelectItem value="German C1-C2">German C1-C2</SelectItem>
                        <SelectItem value="French A1-A2">French A1-A2</SelectItem>
                        <SelectItem value="French B1-B2">French B1-B2</SelectItem>
                        <SelectItem value="French C1-C2">French C1-C2</SelectItem>
                        <SelectItem value="None">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="financialAssets">
                      Financial Assets (USD)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="inline w-4 h-4 ml-1 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Your total available funds for visa process and relocation</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      id="financialAssets"
                      type="number"
                      min="0"
                      placeholder="Enter your financial assets in USD"
                      value={profile.financialAssets || ""}
                      onChange={(e) => handleInputChange("financialAssets", Number.parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="annualIncome">
                      Annual Income (USD)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="inline w-4 h-4 ml-1 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Your current yearly income from employment or other sources</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      id="annualIncome"
                      type="number"
                      min="0"
                      placeholder="Enter your annual income in USD"
                      value={profile.annualIncome || ""}
                      onChange={(e) => handleInputChange("annualIncome", Number.parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visaType">Visa Type Preference</Label>
                    <Select value={profile.visaType} onValueChange={(value) => handleInputChange("visaType", value)}>
                      <SelectTrigger id="visaType" aria-label="Select visa type preference">
                        <SelectValue placeholder="Select visa type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Study">Study</SelectItem>
                        <SelectItem value="Work">Work</SelectItem>
                        <SelectItem value="Immigration">Immigration/Family Reunification</SelectItem>
                        <SelectItem value="Tourist">Tourist</SelectItem>
                        <SelectItem value="Investor">Investor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Optional Fields Section - Collapsible */}
              <div className="border rounded-lg">
                <details className="group">
                  <summary className="flex items-center justify-between p-4 cursor-pointer">
                    <h3 className="text-sm font-medium text-gray-500 uppercase">Additional Details (Optional)</h3>
                    <svg
                      className="w-5 h-5 transition-transform group-open:rotate-180"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </summary>
                  <div className="p-4 pt-0 space-y-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        min="18"
                        max="100"
                        placeholder="Enter your age"
                        value={profile.age || ""}
                        onChange={(e) => handleInputChange("age", Number.parseInt(e.target.value) || undefined)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="preferredRegion">Preferred Destination Region</Label>
                      <Select
                        value={profile.preferredRegion?.[0] || ""}
                        onValueChange={(value) => handleInputChange("preferredRegion", [value])}
                      >
                        <SelectTrigger id="preferredRegion" aria-label="Select preferred region">
                          <SelectValue placeholder="Select preferred region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="North America">North America</SelectItem>
                          <SelectItem value="Europe">Europe</SelectItem>
                          <SelectItem value="Asia">Asia</SelectItem>
                          <SelectItem value="Oceania">Oceania</SelectItem>
                          <SelectItem value="Middle East">Middle East</SelectItem>
                          <SelectItem value="Africa">Africa</SelectItem>
                          <SelectItem value="South America">South America</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maritalStatus">Marital Status</Label>
                      <Select
                        value={profile.maritalStatus || ""}
                        onValueChange={(value) => handleInputChange("maritalStatus", value)}
                      >
                        <SelectTrigger id="maritalStatus" aria-label="Select marital status">
                          <SelectValue placeholder="Select marital status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Married">Married</SelectItem>
                          <SelectItem value="Divorced">Divorced</SelectItem>
                          <SelectItem value="Widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dependents">
                        Dependents
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="inline w-4 h-4 ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Number of dependents (spouse, children) accompanying you</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="dependents"
                        type="number"
                        min="0"
                        placeholder="Enter number of dependents"
                        value={profile.dependents || ""}
                        onChange={(e) => handleInputChange("dependents", Number.parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="criminalRecord">Criminal Record</Label>
                      <Select
                        value={profile.criminalRecord || ""}
                        onValueChange={(value) => handleInputChange("criminalRecord", value)}
                      >
                        <SelectTrigger id="criminalRecord" aria-label="Select criminal record status">
                          <SelectValue placeholder="Select criminal record status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="Minor Offenses">Minor Offenses</SelectItem>
                          <SelectItem value="Major Offenses">Major Offenses</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="healthStatus">Health Status</Label>
                      <Select
                        value={profile.healthStatus || ""}
                        onValueChange={(value) => handleInputChange("healthStatus", value)}
                      >
                        <SelectTrigger id="healthStatus" aria-label="Select health status">
                          <SelectValue placeholder="Select health status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="No Major Issues">No Major Issues</SelectItem>
                          <SelectItem value="Chronic Condition">Chronic Condition</SelectItem>
                          <SelectItem value="Disability">Disability</SelectItem>
                          <SelectItem value="Requires Medical Exam">Requires Medical Exam</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="previousRejections">Previous Visa Rejections</Label>
                      <Select
                        value={profile.previousRejections || ""}
                        onValueChange={(value) => handleInputChange("previousRejections", value)}
                      >
                        <SelectTrigger id="previousRejections" aria-label="Select previous visa rejections">
                          <SelectValue placeholder="Select previous visa rejections" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="1 Rejection">1 Rejection</SelectItem>
                          <SelectItem value="2+ Rejections">2+ Rejections</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </details>
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
                    Processing...
                  </>
                ) : (
                  "Get Recommendations"
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Recommendations */}
          <div>
            {hasSubmitted && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recommended Countries</CardTitle>
                    <Button variant="outline" size="sm" onClick={handleSort} className="flex items-center">
                      <span className="mr-1">Sort by {sortOrder === "likelihood" ? "Country" : "Likelihood"}</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardDescription>Based on your profile, we recommend these countries</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paginatedRecommendations.length > 0 ? (
                    paginatedRecommendations.map((recommendation, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Flag className="w-5 h-5 mr-2 text-primary" />
                            <h3 className="text-lg font-medium">{recommendation.country}</h3>
                          </div>
                          {renderLikelihoodBadge(recommendation.approvalLikelihood)}
                        </div>
                        <div className="mb-2">
                          {recommendation.visaTypes.map((type, idx) => (
                            <Badge key={idx} variant="outline" className="mr-2">
                              {type}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">{recommendation.rationale}</p>
                        <div className="flex items-center justify-between mt-3">
                          <Button variant="outline" size="sm" className="text-xs">
                            View Details
                          </Button>
                          <span className="text-xs text-gray-500">
                            {profile.visaType && recommendation.visaTypes.includes(profile.visaType)
                              ? `Recommended for your ${profile.visaType} visa preference`
                              : ""}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-gray-500">No recommendations available</p>
                    </div>
                  )}
                </CardContent>
                {totalPages > 1 && (
                  <CardFooter className="flex justify-center mt-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <Button
                          key={i}
                          variant={currentPage === i + 1 ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </CardFooter>
                )}
              </Card>
            )}
            {!hasSubmitted && (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white border rounded-lg">
                <Globe className="w-16 h-16 mb-4 text-gray-300" />
                <h3 className="mb-2 text-xl font-medium text-gray-700">No Recommendations Yet</h3>
                <p className="text-gray-500">
                  Fill out your profile information and click "Get Recommendations" to see countries that match your
                  profile.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
