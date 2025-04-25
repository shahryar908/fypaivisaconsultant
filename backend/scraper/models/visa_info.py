import sqlite3
import json
from typing import List
from pydantic import BaseModel


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


# Create an instance of VisaInfo for Poland
poland_student_visa = VisaInfo(
    country="Germany",
    visa_type="Student",
    requirements=[
        "Completed and signed national visa application form.",
        "Valid passport (issued within the last 10 years and valid for at least 3 months after return).",
        "Two biometric passport-sized photos (not older than 6 months).",
        "Letter of admission from a German university or preparatory course (Studienkolleg).",
        "Proof of language proficiency (German or English depending on course): TestDaF, IELTS, TOEFL, etc.",
        "Academic certificates and transcripts (with certified translations in German or English).",
        "Proof of financial resources for living expenses (approx. €11,208/year) – often via blocked account (Sperrkonto).",
        "Proof of accommodation in Germany (rental agreement, confirmation from student housing, or invitation letter).",
        "Travel health insurance valid in the Schengen area until you register in Germany and obtain public insurance.",
        "Curriculum Vitae (CV).",
        "Motivation letter explaining your academic and career plans.",
        "Visa application fee payment proof.",
        "Declaration of accuracy of information provided.",
        "In some cases: APS certificate (for applicants from certain countries like India, China, Vietnam)."
    ],
    processing_time=(
        "4 to 12 weeks, depending on the embassy/consulate and time of year. "
        "Students are advised to apply at least 3 months before semester start."
    ),
    validity=(
        "Initially valid for up to 3 to 6 months. After arrival in Germany, you must apply for a "
        "residence permit at the local Foreigners’ Office (Ausländerbehörde) for the full duration of studies."
    ),
    fees="€75 (may vary slightly by country). Fee exemptions possible for scholarship holders.",
    entry_type="Single entry (convertible to long-term residence permit in Germany).",
    allowed_stay=(
        "Visa itself allows entry; after arrival, students must obtain a residence permit for the duration "
        "of the program (usually 1–2 years, extendable)."
    ),
    embassy_link="https://www.auswaertiges-amt.de/en/svisa/visastudium-node",
    notes=(
        "Students can work up to 120 full days or 240 half days per year while studying. "
        "Blocked account (Sperrkonto) is the most common way to prove financial means. "
        "It's strongly advised to apply early due to limited appointment slots at embassies. "
        "After graduation, students can apply for an 18-month job-seeking visa to look for work in Germany."
    )
)



# Connect to SQLite database (or create it)
conn = sqlite3.connect("visa_info.db")
cursor = conn.cursor()

# Create table
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
        notes TEXT
    )
''')

# Insert data
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
    poland_student_visa.country,
    poland_student_visa.visa_type,
    json.dumps(poland_student_visa.requirements),
    poland_student_visa.processing_time,
    poland_student_visa.validity,
    poland_student_visa.fees,
    poland_student_visa.entry_type,
    poland_student_visa.allowed_stay,
    poland_student_visa.embassy_link,
    poland_student_visa.notes
))

# Commit and close
conn.commit()
print("it is inserted")
conn.close()
