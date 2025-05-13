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

# Create instances of VisaInfo for Lithuania
visa_data = [
    VisaInfo(
        country="Lithuania",
        visa_type="Student",
        requirements=[
            "Completed and signed national visa application form (Type D).",
            "Valid passport (issued within the last 10 years, valid for at least 3 months after planned departure).",
            "One recent passport-sized photo (35x45 mm, white background, taken within the last 6 months).",
            "Acceptance letter from a recognized Lithuanian higher education institution or exchange program.",
            "Proof of language proficiency (English: IELTS 6.0, TOEFL iBT 80; or Lithuanian proficiency if required by program).",
            "Academic certificates and transcripts (translated into English or Lithuanian, certified if required).",
            "Proof of financial resources (minimum €150/month or €1,800/year as of 2025, via bank statements, scholarship, or sponsor letter).",
            "Proof of accommodation in Lithuania (rental agreement, dormitory confirmation, or host letter).",
            "Health insurance (minimum coverage €30,000, valid in Lithuania and Schengen area for initial stay).",
            "Curriculum Vitae (CV) detailing educational background.",
            "Motivation letter explaining study plans and goals in Lithuania.",
            "Proof of visa fee payment.",
            "Declaration of accuracy of provided information.",
            "Criminal record certificate (if requested by consulate, typically for long-term stays)."
        ],
        processing_time="2–6 weeks, depending on the consulate and application complexity. Apply at least 2 months before program start.",
        validity="Up to 1 year initially; convertible to a temporary residence permit for the duration of studies.",
        fees="€120 for Visa D; €120 for temporary residence permit (if required).",
        entry_type="Multiple entry (allows travel within Schengen area during validity).",
        allowed_stay="Duration of the study program (typically 1–2 years, extendable up to 7 years for full degree programs).",
        embassy_link="https://www.migracija.lt/en",
        notes=(
            "Non-EU students can work up to 20 hours/week during term-time and full-time during holidays without a work permit. "
            "Register with the Migration Department within 3 months of arrival to obtain a temporary residence permit if staying over 90 days. "
            "A temporary residence permit for job seeking (up to 12 months) is available after graduation. "
            "Apply through the Lithuanian Migration Information System (MIGRIS) for residence permits. "
            "EU/EEA students only need a certificate from the Ministry of the Interior for stays over 3 months."
        )
    ),
    VisaInfo(
        country="Lithuania",
        visa_type="Work",
        requirements=[
            "Completed and signed national visa application form (Type D).",
            "Valid passport (issued within the last 10 years, valid for at least 3 months after planned departure).",
            "One recent passport-sized photo (35x45 mm, white background, taken within the last 6 months).",
            "Work permit issued by the Lithuanian Labour Exchange or a binding job offer (for permit-exempt categories).",
            "Employment contract or letter of intent from a Lithuanian employer, specifying position and salary.",
            "Proof of qualifications (university degree, vocational certificates, or professional licenses, translated into Lithuanian or English).",
            "Proof of financial resources (minimum €1,038/month as of 2025, via bank statements or employer guarantee).",
            "Proof of accommodation in Lithuania (rental agreement, employer-provided housing, or host letter).",
            "Health insurance (minimum coverage €30,000, valid in Lithuania for initial stay, later social insurance enrollment).",
            "Curriculum Vitae (CV) detailing professional experience and skills.",
            "Proof of visa fee payment.",
            "Declaration of accuracy of provided information.",
            "Criminal record certificate (if requested by consulate, typically for regulated professions)."
        ],
        processing_time="2–6 weeks, depending on the consulate and work permit processing time.",
        validity="Up to 1 year initially; extendable via a temporary residence permit for up to 2 years (3 years for Blue Card holders).",
        fees="€120 for Visa D; €120 for temporary residence permit (if required).",
        entry_type="Multiple entry (allows travel within Schengen area during validity).",
        allowed_stay="Duration of the work contract, typically 1–2 years, extendable with a residence permit.",
        embassy_link="https://www.migracija.lt/en",
        notes=(
            "Work visas are tied to a specific employer; changing employers requires a new work permit or notification. "
            "EU Blue Card is available for highly skilled workers with a salary threshold (approx. €27,000/year in 2025). "
            "Family members of Blue Card holders or researchers can join immediately with residence permits. "
            "Register with the Migration Department within 3 months of arrival for stays over 90 days. "
            "A1 certificate required for posted workers from EU/EEA to prove social security coverage."
        )
    ),
    VisaInfo(
        country="Lithuania",
        visa_type="Tourist",
        requirements=[
            "Completed and signed Schengen visa application form (Type C).",
            "Valid passport (issued within the last 10 years, valid for at least 3 months after planned departure).",
            "One recent passport-sized photo (35x45 mm, white background, taken within the last 6 months).",
            "Travel itinerary (flight reservations, train tickets, or planned activities in Lithuania).",
            "Proof of financial means (minimum €40/day as of 2025, via bank statements, credit card, or sponsor letter).",
            "Travel health insurance (minimum coverage €30,000, valid across Schengen countries for the entire stay).",
            "Proof of accommodation (hotel bookings, Airbnb confirmation, or invitation letter from a host in Lithuania).",
            "Proof of ties to home country (e.g., employment contract, property ownership, family responsibilities).",
            "Proof of visa fee payment.",
            "Declaration of accuracy of provided information.",
            "Additional documents if applicable (e.g., parental consent for minors, invitation letter for visiting family)."
        ],
        processing_time="15–45 days, up to 60 days in complex cases or high application volume.",
        validity="Up to 90 days within a 180-day period in the Schengen Area.",
        fees="€80 (reduced to €40 for children aged 6–12; free for children under 6; exemptions for certain students).",
        entry_type="Single, double, or multiple entry, depending on consulate decision and travel history.",
        allowed_stay="Maximum 90 days within 180 days in the Schengen Area.",
        embassy_link="https://www.migracija.lt/en",
        notes=(
            "Overstaying the 90-day limit can result in fines, deportation, or a Schengen entry ban. "
            "Apply through the Lithuanian consulate or VFS Global if Lithuania is the main destination or first point of entry. "
            "Visa-free entry for up to 90 days is available for citizens of certain countries (e.g., US, Canada, Australia, Japan). "
            "ETIAS authorization will be required starting mid-2025 for visa-exempt travelers. "
            "Submit biometric data (fingerprints) at the consulate or visa center, except for children under 12."
        )
    )
]

# Connect to SQLite database
try:
    conn = sqlite3.connect("../visa_info.db")
    cursor = conn.cursor()
    logger.info("Successfully connected to visa_info.db")
except sqlite3.Error as e:
    logger.error(f"Failed to connect to database: {e}")
    raise

# Delete all records for Germany
try:
    cursor.execute("DELETE FROM visa_info WHERE country = 'Lithuania'")
    deleted_rows = cursor.rowcount
    conn.commit()
    logger.info(f"Deleted {deleted_rows} records for Lithuania")
except sqlite3.Error as e:
    logger.error(f"Failed to delete records for Lithuania: {e}")
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

# Verify all visa types for Germany and Poland
countries = ["Germany", "Poland"]
for country in countries:
    try:
        cursor.execute('''
            SELECT visa_type FROM visa_info
        ''')
        visa_types = [row[0] for row in cursor.fetchall()]
        if visa_types:
            logger.info(f"Visa types for {country}: {', '.join(visa_types)}")
        else:
            logger.warning(f"No visa types found for {country}")
    except sqlite3.Error as e:
        logger.error(f"Failed to fetch visa types for {country}: {e}")

# Commit and close
try:
    conn.commit()
    conn.close()
    logger.info("Database connection closed")
except sqlite3.Error as e:
    logger.error(f"Failed to close database connection: {e}")