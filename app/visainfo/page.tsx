"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Search,
  Globe,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  X,
  RefreshCw,
  Filter,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  CreditCard,
  FileText,
  Info,
  CalendarRange,
  Plane,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"

// Define TypeScript interfaces
interface VisaInfo {
  id: number
  country: string
  visa_type: string
  requirements: string[]
  processing_time: string
  validity: string
  fees: string
  entry_type: string
  allowed_stay: string
  embassy_link: string | null
  notes: string | null
  error: string | null
}

export default function VisaPortal() {
  // State variables
  const [searchTerm, setSearchTerm] = useState("")
  const [countries, setCountries] = useState<string[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [visaTypes, setVisaTypes] = useState<string[]>([])
  const [selectedVisaType, setSelectedVisaType] = useState<string>("")
  const [visaResults, setVisaResults] = useState<VisaInfo[]>([])
  const [selectedVisa, setSelectedVisa] = useState<VisaInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filtersVisible, setFiltersVisible] = useState(false)

  // API base URL - in a real app, this would be in an environment variable
  const API_BASE_URL = "http://localhost:5000"

  // Fetch all countries on component mount
  useEffect(() => {
    fetchCountries()
  }, [])

  // Fetch visa types when a country is selected
  useEffect(() => {
    if (selectedCountry) {
      fetchVisaTypes(selectedCountry)
      fetchVisasByCountry(selectedCountry)
    }
  }, [selectedCountry])

  // Fetch visa details when both country and visa type are selected
  useEffect(() => {
    if (selectedCountry && selectedVisaType) {
      fetchVisaDetails(selectedCountry, selectedVisaType)
    }
  }, [selectedCountry, selectedVisaType])

  // API functions
  const fetchCountries = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/countries`)
      if (!response.ok) throw new Error("Failed to fetch countries")

      const data = await response.json()
      setCountries(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const fetchVisaTypes = async (country: string) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/visa/country/${country}/types`)
      if (!response.ok) throw new Error(`Failed to fetch visa types for ${country}`)

      const data = await response.json()
      setVisaTypes(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const fetchVisasByCountry = async (country: string) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/visa/country/${country}`)
      if (!response.ok) throw new Error(`Failed to fetch visa information for ${country}`)

      const data = await response.json()
      setVisaResults(data.data || [])
      setSelectedVisa(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const fetchVisaDetails = async (country: string, visaType: string) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/visa/country/${country}/type/${visaType}`)
      if (!response.ok) throw new Error(`Failed to fetch details for ${visaType} visa in ${country}`)

      const data = await response.json()
      setSelectedVisa(data.data || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const searchVisas = async () => {
    if (!searchTerm.trim()) return

    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/visa/search?term=${encodeURIComponent(searchTerm)}`)
      if (!response.ok) throw new Error("Search failed")

      const data = await response.json()
      setVisaResults(data.data || [])
      setSelectedVisa(null)

      // Reset selections since we're searching
      setSelectedCountry("")
      setSelectedVisaType("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const fetchAllVisas = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/visa`)
      if (!response.ok) throw new Error("Failed to fetch all visa information")

      const data = await response.json()
      setVisaResults(data.data || [])
      setSelectedVisa(null)

      // Reset selections
      setSelectedCountry("")
      setSelectedVisaType("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Reset filters
  const resetFilters = () => {
    setSelectedCountry("")
    setSelectedVisaType("")
    setSearchTerm("")
    setVisaResults([])
    setSelectedVisa(null)
  }

  // Handle search input keypress
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchVisas()
    }
  }

  // Clear notifications
  const clearNotifications = () => {
    setError(null)
  }

  // Toggle filters visibility on mobile
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible)
  }

  // Format visa type for display
  const formatVisaType = (visaType: string) => {
    // Extract visa code if it exists in parentheses
    const match = visaType.match(/$$(.*?)$$/)
    if (match) {
      const code = match[1]
      const name = visaType.replace(`(${code})`, "").trim()
      return (
        <>
          {name}{" "}
          <Badge variant="outline" className="ml-1">
            {code}
          </Badge>
        </>
      )
    }
    return visaType
  }

  // Get appropriate icon for visa type
  const getVisaTypeIcon = (visaType: string) => {
    const type = visaType.toLowerCase()
    if (type.includes("tourist") || type.includes("visitor")) return <Plane className="h-4 w-4" />
    if (type.includes("business")) return <FileText className="h-4 w-4" />
    if (type.includes("student")) return <FileText className="h-4 w-4" />
    if (type.includes("work")) return <FileText className="h-4 w-4" />
    return <FileText className="h-4 w-4" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300">
            Visa Information Portal
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Find comprehensive visa requirements, processing times, and essential information for countries worldwide
          </p>
        </header>

        {/* Notification area */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="mb-6"
            >
              <Alert variant="destructive">
                <AlertTitle className="flex items-center justify-between">
                  Error
                  <Button variant="ghost" size="sm" onClick={clearNotifications}>
                    <X className="h-4 w-4" />
                  </Button>
                </AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-6xl mx-auto">
          {/* Search and filter section */}
          <Card className="mb-8 border-0 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 text-white p-6">
              <h2 className="text-2xl font-bold">Light Up Your Visa Path with Instant Clarity!</h2>
              <p className="text-slate-200 mt-1">Search by country, visa type, or keywords</p>
            </div>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Search bar */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Search visa information..."
                      className="pl-9 h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={handleSearchKeyPress}
                    />
                  </div>
                  <Button
                    onClick={searchVisas}
                    disabled={loading}
                    className="h-12 px-6 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      "Search"
                    )}
                  </Button>
                  <Button variant="outline" className="h-12 md:hidden" onClick={toggleFilters}>
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>

                {/* Filters - always visible on desktop, toggleable on mobile */}
                <div className={`space-y-4 ${filtersVisible ? "block" : "hidden md:block"}`}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Country</label>
                      <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                        <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Visa Type</label>
                      <Select
                        value={selectedVisaType}
                        onValueChange={setSelectedVisaType}
                        disabled={!selectedCountry || visaTypes.length === 0}
                      >
                        <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                          <SelectValue placeholder={selectedCountry ? "Select visa type" : "Select a country first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {visaTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <Button
                      variant="link"
                      onClick={fetchAllVisas}
                      className="text-sm text-slate-700 dark:text-slate-300 p-0 h-auto"
                    >
                      View All Visa Information
                    </Button>
                    <Button
                      variant="outline"
                      onClick={resetFilters}
                      size="sm"
                      className="text-sm border-slate-200 dark:border-slate-800"
                    >
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results and details section */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Results list */}
            <div className={`${selectedVisa ? "md:col-span-1" : "md:col-span-3"}`}>
              {visaResults.length > 0 ? (
                <Card className="h-full border-0 shadow-lg overflow-hidden">
                  <div className="bg-slate-100 dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Visa Information</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {selectedCountry ? `Showing visas for ${selectedCountry}` : "Search results"}
                        </p>
                      </div>
                      <Badge className="bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200">
                        {visaResults.length} result{visaResults.length !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                  </div>
                  <div className="max-h-[600px] overflow-y-auto">
                    {visaResults.map((visa, index) => (
                      <motion.div
                        key={visa.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <div
                          className={`p-4 border-b border-slate-100 dark:border-slate-800 cursor-pointer transition-colors ${
                            selectedVisa?.id === visa.id
                              ? "bg-slate-100 dark:bg-slate-800"
                              : "hover:bg-slate-50 dark:hover:bg-slate-900"
                          }`}
                          onClick={() => setSelectedVisa(visa)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-start">
                              <div className="mr-3 mt-1 p-1.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                {getVisaTypeIcon(visa.visa_type)}
                              </div>
                              <div>
                                <h3 className="font-medium text-slate-900 dark:text-slate-100">
                                  {formatVisaType(visa.visa_type)}
                                </h3>
                                <div className="flex items-center mt-1 text-sm text-slate-500 dark:text-slate-400">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {visa.country}
                                </div>
                              </div>
                            </div>
                            <ArrowRight
                              className={`h-5 w-5 transition-colors ${
                                selectedVisa?.id === visa.id ? "text-slate-900 dark:text-slate-100" : "text-slate-400"
                              }`}
                            />
                          </div>

                          {/* Preview of key information */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {visa.processing_time && (
                              <Badge
                                variant="outline"
                                className="font-normal text-xs bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                              >
                                <Clock className="h-3 w-3 mr-1" />
                                {visa.processing_time}
                              </Badge>
                            )}
                            {visa.entry_type && (
                              <Badge
                                variant="outline"
                                className="font-normal text-xs bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                              >
                                {visa.entry_type} Entry
                              </Badge>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              ) : (
                <Card className="border-0 shadow-lg overflow-hidden">
                  <CardContent className="p-0">
                    <div className="text-center py-16 px-4">
                      <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Globe className="h-8 w-8 text-slate-400" />
                      </div>
                      <h3 className="text-xl font-medium mb-2 text-slate-900 dark:text-slate-100">
                        No Visa Information
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                        Use the search or select a country to find visa information for your destination
                      </p>
                      <Button variant="outline" onClick={fetchAllVisas}>
                        Browse All Visas
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Detailed visa information */}
            {selectedVisa && (
              <motion.div
                className="md:col-span-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 text-white p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="mr-4 p-2.5 rounded-full bg-white/10 text-white">
                          {getVisaTypeIcon(selectedVisa.visa_type)}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{formatVisaType(selectedVisa.visa_type)}</h2>
                          <div className="flex items-center mt-1 text-slate-200">
                            <MapPin className="h-4 w-4 mr-1" />
                            {selectedVisa.country}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedVisa.entry_type && (
                          <Badge className="bg-white/20 text-white hover:bg-white/20 hover:text-white">
                            {selectedVisa.entry_type} Entry
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedVisa(null)}
                          className="md:hidden text-white"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-8">
                      {/* Key information */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedVisa.processing_time && (
                          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
                            <Clock className="h-6 w-6 text-slate-500 mb-2" />
                            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                              Processing Time
                            </div>
                            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                              {selectedVisa.processing_time}
                            </p>
                          </div>
                        )}

                        {selectedVisa.validity && (
                          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
                            <Calendar className="h-6 w-6 text-slate-500 mb-2" />
                            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Validity</div>
                            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                              {selectedVisa.validity}
                            </p>
                          </div>
                        )}

                        {selectedVisa.fees && (
                          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
                            <CreditCard className="h-6 w-6 text-slate-500 mb-2" />
                            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Fees</div>
                            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                              {selectedVisa.fees}
                            </p>
                          </div>
                        )}

                        {selectedVisa.allowed_stay && (
                          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
                            <CalendarRange className="h-6 w-6 text-slate-500 mb-2" />
                            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                              Allowed Stay
                            </div>
                            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                              {selectedVisa.allowed_stay}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Requirements */}
                      {selectedVisa.requirements && selectedVisa.requirements.length > 0 && (
                        <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                          <div className="bg-slate-100 dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Requirements</h3>
                          </div>
                          <div className="p-6">
                            <div className="space-y-3">
                              {selectedVisa.requirements.map((req, index) => (
                                <motion.div
                                  key={index}
                                  className="flex items-start p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800"
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.2, delay: index * 0.05 }}
                                >
                                  <CheckCircle className="h-5 w-5 mr-3 text-green-500 flex-shrink-0 mt-0.5" />
                                  <span className="text-slate-700 dark:text-slate-300">{req}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {selectedVisa.notes && (
                        <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                          <div className="bg-slate-100 dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center">
                              <Info className="h-5 w-5 mr-2" />
                              Additional Notes
                            </h3>
                          </div>
                          <div className="p-6">
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selectedVisa.notes}</p>
                          </div>
                        </div>
                      )}

                      {/* Error information */}
                      {selectedVisa.error && (
                        <Alert variant="destructive" className="rounded-lg">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          <AlertTitle>Important Notice</AlertTitle>
                          <AlertDescription>{selectedVisa.error}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>

                  {/* Embassy Link */}
                  {selectedVisa.embassy_link && (
                    <CardFooter className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                      <a href={selectedVisa.embassy_link} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button className="w-full bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600">
                          Visit Official Embassy Website
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </a>
                    </CardFooter>
                  )}
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        <footer className="mt-16 text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-8">
          <p>Visa Information Portal &copy; {new Date().getFullYear()}</p>
          <p className="mt-2 max-w-2xl mx-auto">
            This information is for reference only. Always check with the official embassy or consulate for the most
            up-to-date visa requirements and procedures.
          </p>
        </footer>
      </div>
    </div>
  )
}
