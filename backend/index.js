// Setup for Express.js API endpoints to access visa information from SQLite database
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database(path.join(__dirname, '../visa_info.db'), (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the visa information database');
    
    // Create table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS visa_info (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      country TEXT NOT NULL,
      visa_type TEXT NOT NULL,
      requirements TEXT,
      processing_time TEXT,
      validity TEXT,
      fees TEXT,
      entry_type TEXT,
      allowed_stay TEXT,
      embassy_link TEXT,
      notes TEXT,
      error TEXT
    )`, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Table verified or created successfully');
      }
    });
  }
});

// API Routes

// 1. Get all visa information
app.get('/api/visa', (req, res) => {
  db.all('SELECT * FROM visa_info', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Process the requirements field which is stored as TEXT but represents an array
    const processedRows = rows.map(row => ({
      ...row,
      requirements: row.requirements ? JSON.parse(row.requirements) : []
    }));
    
    res.json({ data: processedRows });
  });
});

// 2. Get visa information by country
app.get('/api/visa/country/:country', (req, res) => {
  const country = req.params.country;
  
  db.all('SELECT * FROM visa_info WHERE LOWER(country) = LOWER(?)', [country], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (rows.length === 0) {
      return res.status(404).json({ message: `No visa information found for ${country}` });
    }
    
    // Process the requirements field
    const processedRows = rows.map(row => ({
      ...row,
      requirements: row.requirements ? JSON.parse(row.requirements) : []
    }));
    
    res.json({ data: processedRows });
  });
});

// 3. Get visa information by country and visa type
app.get('/api/visa/country/:country/type/:type', (req, res) => {
  const { country, type } = req.params;
  
  db.get(
    'SELECT * FROM visa_info WHERE LOWER(country) = LOWER(?) AND LOWER(visa_type) = LOWER(?)',
    [country, type],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!row) {
        return res.status(404).json({ 
          message: `No ${type} visa information found for ${country}` 
        });
      }
      
      // Process the requirements field
      const processedRow = {
        ...row,
        requirements: row.requirements ? JSON.parse(row.requirements) : []
      };
      
      res.json({ data: processedRow });
    }
  );
});

// 4. Get all available countries
app.get('/api/countries', (req, res) => {
  db.all('SELECT DISTINCT country FROM visa_info ORDER BY country', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const countries = rows.map(row => row.country);
    res.json({ data: countries });
  });
});

// 5. Get visa types available for a specific country
app.get('/api/visa/country/:country/types', (req, res) => {
  const country = req.params.country;
  
  db.all(
    'SELECT visa_type FROM visa_info WHERE LOWER(country) = LOWER(?) ORDER BY visa_type',
    [country],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (rows.length === 0) {
        return res.status(404).json({ message: `No visa information found for ${country}` });
      }
      
      const visaTypes = rows.map(row => row.visa_type);
      res.json({ data: visaTypes });
    }
  );
});

// 6. Search visa information
app.get('/api/visa/search', (req, res) => {
  const searchTerm = req.query.term;
  
  if (!searchTerm) {
    return res.status(400).json({ message: 'Search term is required' });
  }
  
  const query = `
    SELECT * FROM visa_info 
    WHERE LOWER(country) LIKE LOWER(?) 
    OR LOWER(visa_type) LIKE LOWER(?) 
    OR LOWER(notes) LIKE LOWER(?)
  `;
  
  const param = `%${searchTerm}%`;
  
  db.all(query, [param, param, param], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Process the requirements field
    const processedRows = rows.map(row => ({
      ...row,
      requirements: row.requirements ? JSON.parse(row.requirements) : []
    }));
    
    res.json({ data: processedRows });
  });
});

// 7. Import visa information from JSON
app.post('/api/visa/import', (req, res) => {
  const visaData = req.body;
  
  if (!Array.isArray(visaData)) {
    return res.status(400).json({ message: 'Expected an array of visa information' });
  }
  
  // Begin transaction
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    const stmt = db.prepare(`
      INSERT INTO visa_info 
      (country, visa_type, requirements, processing_time, validity, fees, entry_type, allowed_stay, embassy_link, notes, error)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    let successCount = 0;
    
    visaData.forEach(visa => {
      try {
        // Convert requirements array to JSON string for storage
        const requirementsJSON = JSON.stringify(visa.requirements || []);
        
        stmt.run(
          visa.country,
          visa.visa_type,
          requirementsJSON,
          visa.processing_time || '',
          visa.validity || '',
          visa.fees || '',
          visa.entry_type || '',
          visa.allowed_stay || '',
          visa.embassy_link || null,
          visa.notes || null,
          visa.error || null,
          function(err) {
            if (!err) successCount++;
          }
        );
      } catch (err) {
        console.error('Error inserting visa data:', err);
      }
    });
    
    stmt.finalize();
    
    db.run('COMMIT', function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      res.json({ 
        message: `Successfully imported ${successCount} visa entries`,
        successCount
      });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Close database connection when the app terminates
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Closed the database connection');
    process.exit(0);
  });
});