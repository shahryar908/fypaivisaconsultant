# config.py

# Base URL for visa information (example using a visa service provider)
BASE_URL = "https://www.visahq.com/citizens/United-States"

# CSS selector for visa information containers
CSS_SELECTOR = ".country-data-container"

# Required fields for a complete visa information entry
REQUIRED_KEYS = [
    "country",
    "visa_type",
    "requirements",
    "processing_time",
    "validity",
    "fees",
    "entry_type",
    "allowed_stay",
]

# List of countries to crawl
COUNTRIES_TO_CRAWL = [
    "germany",
    # Add more countries as needed
]

# Optional: Add source websites for different countries
COUNTRY_SOURCES = {
    "germany": "https://www.germany-visa.org/student-visa/student-visa-visum-zu-studienzwecken/",
    # Add more specific sources
}