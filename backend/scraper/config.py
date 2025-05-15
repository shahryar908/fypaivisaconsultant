# config.py

# Base URL for visa information (example using a visa service provider)
BASE_URL="https://www.gov.pl/web/pakistan-en/d-type-national-visa"
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
    "poland",
    # Add more countries as needed
]

# Optional: Add source websites for different countries
COUNTRY_SOURCES = {
    "poland": "https://www.gov.pl/web/pakistan-en/d-type-national-visa",
    # Add more specific sources
}