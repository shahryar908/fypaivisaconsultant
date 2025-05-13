import sqlite3

# Connect to the SQLite database
conn = sqlite3.connect('../visa_info.db')
cursor = conn.cursor()

# Fetch all rows from the 'visa_info' table
cursor.execute("SELECT * FROM visa_info;")
rows = cursor.fetchall()

# Print all rows
print("Data in visa_info table:")
for row in rows:
    print(row)

# Close the connection
conn.close()
