// File: app/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Globe, Clock, CreditCard, Plane } from "lucide-react";

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

export default function VisaConsultant() {
  const { toast } = useToast();
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [visaTypes, setVisaTypes] = useState([]);
  const [selectedVisaType, setSelectedVisaType] = useState('');
  const [visaInfo, setVisaInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Fetch all countries on component mount
  useEffect(() => {
    fetchCountries();
  }, []);

  // Fetch visa types when country changes
  useEffect(() => {
    if (selectedCountry) {
      fetchVisaTypes(selectedCountry);
      setSelectedVisaType('');
      setVisaInfo(null);
    }
  }, [selectedCountry]);

  // Fetch visa info when both country and visa type are selected
  useEffect(() => {
    if (selectedCountry && selectedVisaType) {
      fetchVisaInfo(selectedCountry, selectedVisaType);
    }
  }, [selectedCountry, selectedVisaType]);

  // Fetch all countries
  const fetchCountries = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/countries`);
      const data = await response.json();
      setCountries(data.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch countries. Please try again later.",
        variant: "destructive",
      });
      console.error('Error fetching countries:', error);
    }
  };

  // Fetch visa types for selected country
  const fetchVisaTypes = async (country) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/visa/country/${country}/types`);
      const data = await response.json();
      setVisaTypes(data.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch visa types for ${country}.`,
        variant: "destructive",
      });
      console.error('Error fetching visa types:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch visa info for selected country and visa type
  const fetchVisaInfo = async (country, visaType) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/visa/country/${country}/type/${visaType}`);
      if (!response.ok) {
        throw new Error('Visa information not found');
      }
      const data = await response.json();
      setVisaInfo(data.data);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch visa information for ${visaType} visa in ${country}.`,
        variant: "destructive",
      });
      console.error('Error fetching visa info:', error);
      setVisaInfo(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Search Error",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/visa/search?term=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setSearchResults(data.data || []);
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Failed to perform search. Please try again.",
        variant: "destructive",
      });
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  // Render visa information card
  const renderVisaInfoCard = (info) => {
    if (!info) return null;

    return (
      <Card className="w-full mt-4">
        <CardHeader>
          <CardTitle>{info.visa_type} Visa - {info.country}</CardTitle>
          <CardDescription>Complete visa information and requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {info.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{info.error}</AlertDescription>
              </Alert>
            )}

            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Clock className="h-5 w-5" /> Processing Time
              </h3>
              <p className="text-muted-foreground">{info.processing_time || "Information not available"}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                <CreditCard className="h-5 w-5" /> Fees
              </h3>
              <p className="text-muted-foreground">{info.fees || "Information not available"}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Plane className="h-5 w-5" /> Validity & Stay Duration
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Validity:</p>
                  <p className="text-muted-foreground">{info.validity || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Allowed Stay:</p>
                  <p className="text-muted-foreground">{info.allowed_stay || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Entry Type:</p>
                  <p className="text-muted-foreground">{info.entry_type || "Not specified"}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Requirements</h3>
              {info.requirements && info.requirements.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  {info.requirements.map((req, index) => (
                    <li key={index} className="text-muted-foreground">{req}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No specific requirements listed</p>
              )}
            </div>

            {info.notes && (
              <div>
                <h3 className="text-lg font-medium">Additional Notes</h3>
                <p className="text-muted-foreground">{info.notes}</p>
              </div>
            )}

            {info.embassy_link && (
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Globe className="h-5 w-5" /> Embassy Information
                </h3>
                <a 
                  href={info.embassy_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Visit Embassy Website
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Visa Consultant</h1>
      <p className="text-center text-muted-foreground mb-8">
        Find visa information for countries around the world
      </p>

      <Tabs defaultValue="browse" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse by Country</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="mt-6">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="country-select" className="text-sm font-medium">
                  Select Country
                </label>
                <Select 
                  value={selectedCountry} 
                  onValueChange={setSelectedCountry}
                >
                  <SelectTrigger id="country-select">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCountry && (
                <div>
                  <label htmlFor="visa-type-select" className="text-sm font-medium">
                    Select Visa Type
                  </label>
                  <Select 
                    value={selectedVisaType} 
                    onValueChange={setSelectedVisaType}
                    disabled={visaTypes.length === 0 || loading}
                  >
                    <SelectTrigger id="visa-type-select">
                      <SelectValue placeholder={loading ? "Loading..." : visaTypes.length === 0 ? "No visa types available" : "Select visa type"} />
                    </SelectTrigger>
                    <SelectContent>
                      {visaTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading visa information...</p>
              </div>
            ) : visaInfo ? (
              renderVisaInfoCard(visaInfo)
            ) : selectedCountry && visaTypes.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Information</AlertTitle>
                <AlertDescription>
                  No visa information available for {selectedCountry}. Please select another country or try searching.
                </AlertDescription>
              </Alert>
            ) : null}
          </div>
        </TabsContent>

        <TabsContent value="search" className="mt-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search by country, visa type or keywords"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>

            {searchResults.length > 0 ? (
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4">Search Results</h2>
                <ScrollArea className="h-[500px]">
                  {searchResults.map((result, index) => (
                    <div key={index} className="mb-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{result.visa_type} Visa</CardTitle>
                              <CardDescription>{result.country}</CardDescription>
                            </div>
                            <Badge>{result.validity}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="font-medium">Processing:</span> {result.processing_time || "N/A"}
                            </div>
                            <div>
                              <span className="font-medium">Fees:</span> {result.fees || "N/A"}
                            </div>
                          </div>
                          {result.error && (
                            <Alert variant="destructive" className="mt-2">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>{result.error}</AlertDescription>
                            </Alert>
                          )}
                        </CardContent>
                        <CardFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedCountry(result.country);
                              setSelectedVisaType(result.visa_type);
                              document.querySelector('[data-value="browse"]').click();
                            }}
                          >
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                      {index < searchResults.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </ScrollArea>
              </div>
            ) : searchTerm && !loading ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Results</AlertTitle>
                <AlertDescription>
                  No visa information found matching your search. Try different keywords.
                </AlertDescription>
              </Alert>
            ) : null}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}