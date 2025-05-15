import sqlite3
import json
import logging
from typing import List
from pydantic import BaseModel

# Set up logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Define the VisaInfo model
class VisaInfo(BaseModel):
    country: str
    visa_type: str
    requirements: List[str]
    processing_time: str
    validity: str
    fees: str
    entry_type: str
    allowed_stay: str
    embassy_link: str
    notes: str

# Create instances of VisaInfo for Hungary
visa_data = [
    VisaInfo(
        country="Hungary",
        visa_type="Student",
        requirements=[
            "Completed and signed application form for residence permit or Type D visa.",
            "Valid passport (issued within the last 10 years, valid for at least 3 months after planned departure, with 2 blank pages).",
            "Two recent passport-sized photos (35x45 mm, white background, taken within the last 6 months).",
            "Acceptance letter from a recognized Hungarian higher education institution (full-time program).",
            "Proof of sufficient funds (approx. €700/month in 2025, via bank statements, scholarship, or sponsor letter).",
            "Comprehensive health insurance (covering medical care, valid in Hungary for the entire stay).",
            "Proof of paid tuition fees (if applicable) or scholarship confirmation.",
            "Proof of accommodation in Hungary (rental agreement, dormitory confirmation, or host letter).",
            "Academic transcripts and certificates (translated into English or Hungarian, certified if required).",
            "Proof of language proficiency (if required by the program, e.g., English: IELTS 6.0, TOEFL iBT 80).",
            "Proof of application fee payment.",
            "Declaration of accuracy of provided information."
        ],
        processing_time="1–2 months, depending on the Hungarian consulate and completeness of application. Apply at least 3 months before program start.",
        validity="Up to 1 year initially; renewable annually for the duration of studies.",
        fees="€60 for Type D visa; €110 for residence permit application (approx. HUF 44,000 in 2025).",
        entry_type="Single entry (Type D visa); convertible to multiple-entry residence permit after arrival.",
        allowed_stay="Duration of the study program, typically 1–4 years, renewable annually.",
        embassy_link="https://www.enterhungary.gov.hu",
        notes=(
            "Non-EU/EEA students can work up to 24 hours/week during term-time and full-time (up to 90 days or 66 workdays) during holidays. "
            "Apply for a residence permit within 15 days of arrival in Hungary via the National Directorate-General for Aliens Policing (NDGAP). "
            "A 'study-to-work' residence permit (9 months) is available after graduation to seek employment or start a business. "
            "EU/EEA students need only register with the immigration office within 90 days for stays over 3 months. "
            "Visa-free nationals must still apply for a residence permit within 30 days of arrival."
        )
    ),
    VisaInfo(
        country="Hungary",
        visa_type="Work",
        requirements=[
            "Completed and signed application form for residence permit or Type D visa.",
            "Valid passport (issued within the last 10 years, valid for at least 3 months after planned departure, with 2 blank pages).",
            "Two recent passport-sized photos (35x45 mm, white background, taken within the last 6 months).",
            "Signed employment contract or binding job offer from a Hungarian employer (specifying position, salary, and conditions).",
            "Proof of qualifications (university degree, vocational certificates, or professional experience, translated into English or Hungarian).",
            "Workforce Needs Registration Form issued by Hungarian authorities (if required, confirming labor market test).",
            "Proof of sufficient funds (approx. €1,000/month in 2025, unless covered by salary).",
            "Comprehensive health insurance (valid in Hungary until social insurance enrollment).",
            "Proof of accommodation in Hungary (rental agreement, employer-provided housing, or host letter).",
            "Proof of application fee payment.",
            "Declaration of accuracy of provided information."
        ],
        processing_time="1–3 months, depending on the Hungarian consulate and labor market test requirements.",
        validity="Up to 1 year initially; renewable for up to 3 years (4 years for EU Blue Card).",
        fees="€60 for Type D visa; €110 for residence permit application (approx. HUF 44,000 in 2025).",
        entry_type="Single entry (Type D visa); convertible to multiple-entry residence permit after arrival.",
        allowed_stay="Duration of the work contract, typically 1–3 years, renewable.",
        embassy_link="https://www.enterhungary.gov.hu",
        notes=(
            "Work permits are employer-specific for the first 3 years; changing employers requires a new permit. "
            "EU Blue Card available for highly skilled workers with a minimum salary of HUF 773,649/month (approx. €1,950 in 2025). "
            "Guest worker permits (for specified employers/occupations) are limited to 3 years, non-extendable, and exclude family reunification. "
            "Apply for a residence permit within 30 days of arrival via NDGAP. "
            "Labor market test may apply unless exempt (e.g., highly skilled roles, intra-corporate transfers)."
        )
    ),
    VisaInfo(
        country="Hungary",
        visa_type="Tourist",
        requirements=[
            "Completed and signed Schengen visa application form (Type C).",
            "Valid passport (issued within the last 10 years, valid for at least 3 months after planned departure, with 2 blank pages).",
            "Two recent passport-sized photos (35x45 mm, white background, taken within the last 6 months).",
            "Travel itinerary (flight reservations, planned activities, or tour bookings in Hungary).",
            "Proof of financial means (minimum €50/day in 2025, via bank statements, credit card, or sponsor letter).",
            "Travel health insurance (minimum coverage €30,000, valid across Schengen countries for the entire stay).",
            "Proof of accommodation (hotel bookings, Airbnb confirmation, or invitation letter from a host in Hungary).",
            "Proof of ties to home country (e.g., employment contract, property ownership, family responsibilities).",
            "Proof of visa fee payment.",
            "Declaration of accuracy of provided information.",
            "Additional documents if applicable (e.g., parental consent for minors, invitation letter for visiting family)."
        ],
        processing_time="15–45 days, up to 60 days in complex cases or high application volume.",
        validity="Up to 90 days within a 180-day period in the Schengen Area.",
        fees="€80 (reduced to €35 for certain nationalities; €40 for children aged 6–12; free for children under 6).",
        entry_type="Single, double, or multiple entry, depending on consulate decision and travel history.",
        allowed_stay="Maximum 90 days within 180 days in the Schengen Area.",
        embassy_link="https://www.enterhungary.gov.hu",
        notes=(
            "Overstaying the 90-day limit may result in fines, deportation, or a Schengen entry ban. "
            "Apply through the Hungarian consulate or VFS Global if Hungary is the main destination or first point of entry. "
            "Visa-free entry for up to 90 days available for citizens of certain countries (e.g., US, Canada, Australia, Japan). "
            "ETIAS authorization required starting Q4 2026 for visa-exempt travelers. "
            "Biometric data (fingerprints and photo) required at the consulate, except for children under 12."
        )
    )
]

# Connect to SQLite database
try:
    conn = sqlite3.connect(r"C:\Users\User\fypaivisaconsultant\visa_info.db")
    cursor = conn.cursor()
    logger.info("Successfully connected to visa_info.db")
except sqlite3.Error as e:
    logger.error(f"Failed to connect to database: {e}")
    raise

# Delete all existing records for Hungary
try:
    cursor.execute("DELETE FROM visa_info WHERE country = 'Hungary'")
    deleted_rows = cursor.rowcount
    conn.commit()
    logger.info(f"Deleted {deleted_rows} records for Hungary")
except sqlite3.Error as e:
    logger.error(f"Failed to delete records for Hungary: {e}")
    conn.close()
    raise

# Create table with unique constraint on country and visa_type
try:
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS visa_info (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            country TEXT,
            visa_type TEXT,
            requirements TEXT,
            processing_time TEXT,
            validity TEXT,
            fees TEXT,
            entry_type TEXT,
            allowed_stay TEXT,
            embassy_link TEXT,
            notes TEXT,
            UNIQUE(country, visa_type)
        )
    ''')
    conn.commit()
    logger.info("Table visa_info created or already exists")
except sqlite3.Error as e:
    logger.error(f"Failed to create table: {e}")
    conn.close()
    raise

# Function to check if a record exists
def record_exists(country: str, visa_type: str) -> bool:
    try:
        cursor.execute('''
            SELECT COUNT(*) FROM visa_info
            WHERE country = ? AND visa_type = ?
        ''', (country, visa_type))
        count = cursor.fetchone()[0]
        logger.info(f"Checked existence of {visa_type} visa for {country}: {'Exists' if count > 0 else 'Does not exist'}")
        return count > 0
    except sqlite3.Error as e:
        logger.error(f"Failed to check record existence for {visa_type} in {country}: {e}")
        raise

# Insert visa data
for visa in visa_data:
    try:
        if not record_exists(visa.country, visa.visa_type):
            cursor.execute('''
                INSERT INTO visa_info (
                    country,
                    visa_type,
                    requirements,
                    processing_time,
                    validity,
                    fees,
                    entry_type,
                    allowed_stay,
                    embassy_link,
                    notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                visa.country,
                visa.visa_type,
                json.dumps(visa.requirements),
                visa.processing_time,
                visa.validity,
                visa.fees,
                visa.entry_type,
                visa.allowed_stay,
                visa.embassy_link,
                visa.notes
            ))
            conn.commit()
            logger.info(f"Inserted {visa.visa_type} visa for {visa.country}")
        else:
            logger.info(f"Skipped {visa.visa_type} visa for {visa.country}: Record already exists")
    except sqlite3.IntegrityError as e:
        logger.error(f"IntegrityError for {visa.visa_type} visa in {visa.country}: {e}")
    except sqlite3.Error as e:
        logger.error(f"Database error for {visa.visa_type} visa in {visa.country}: {e}")
    except Exception as e:
        logger.error(f"Unexpected error for {visa.visa_type} visa in {visa.country}: {e}")

# Commit and close
try:
    conn.commit()
    conn.close()
    logger.info("Database connection closed")
except sqlite3.Error as e:
    logger.error(f"Failed to close database connection: {e}")