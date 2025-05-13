import express, { Application, Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import path from 'path';
import * as dotenv from 'dotenv'
import chatRoutes from './routes/chat';
import { Clerk } from '@clerk/clerk-sdk-node';
const app:Application = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

const clerk= new (Clerk as any)({
  secretKey: process.env.CLERK_SECRET_KEY
});
// Enable verbose mode
const sqliteVerbose = sqlite3.verbose();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/chat', chatRoutes);

// Connect to SQLite database
const db = new sqliteVerbose.Database(
  path.join(__dirname, '../visa_info.db'),
  (err: Error | null) => {
    if (err) {
      console.error('Error connecting to database:', err.message);
    } else {
      console.log('Connected to the visa information database');

      // Create table if it doesn't exist
      db.run(
        `CREATE TABLE IF NOT EXISTS visa_info (
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
        )`,
        (err: Error | null) => {
          if (err) {
            console.error('Error creating table:', err.message);
          } else {
            console.log('Table verified or created successfully');
          }
        }
      );
    }
  }
);

// Routes

app.get('/api/visa', (req: Request, res: Response) => {
  db.all('SELECT * FROM visa_info', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const processedRows = rows.map((row: any) => ({
      ...row,
      requirements: row.requirements ? JSON.parse(row.requirements) : []
    }));

    res.json({ data: processedRows });
  });
});

app.get('/api/visa/country/:country', (req: Request, res: Response) => {
  const country = req.params.country;

  db.all(
    'SELECT * FROM visa_info WHERE LOWER(country) = LOWER(?)',
    [country],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      if (rows.length === 0) {
        return res
          .status(404)
          .json({ message: `No visa information found for ${country}` });
      }

      const processedRows = rows.map((row: any) => ({
        ...row,
        requirements: row.requirements ? JSON.parse(row.requirements) : []
      }));

      res.json({ data: processedRows });
    }
  );
});

app.get('/api/visa/country/:country/type/:type', (req: Request, res: Response) => {
  const { country, type } = req.params;

  db.get(
    'SELECT * FROM visa_info WHERE LOWER(country) = LOWER(?) AND LOWER(visa_type) = LOWER(?)',
    [country, type],
    (err, row: any) => {
      if (err) return res.status(500).json({ error: err.message });

      if (!row) {
        return res.status(404).json({
          message: `No ${type} visa information found for ${country}`
        });
      }

      const processedRow = {
        ...row,
        requirements: row.requirements ? JSON.parse(row.requirements) : []
      };

      res.json({ data: processedRow });
    }
  );
});

app.get('/api/countries', (req: Request, res: Response) => {
  db.all(
    'SELECT DISTINCT country FROM visa_info ORDER BY country',
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      const countries = rows.map((row: any) => row.country);
      res.json({ data: countries });
    }
  );
});

app.get('/api/visa/country/:country/types', (req: Request, res: Response) => {
  const country = req.params.country;

  db.all(
    'SELECT visa_type FROM visa_info WHERE LOWER(country) = LOWER(?) ORDER BY visa_type',
    [country],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      if (rows.length === 0) {
        return res
          .status(404)
          .json({ message: `No visa information found for ${country}` });
      }

      const visaTypes = rows.map((row: any) => row.visa_type);
      res.json({ data: visaTypes });
    }
  );
});

app.get('/api/visa/search', (req: Request, res: Response)=> {
  const searchTerm = req.query.term as string | undefined;


  const query = `
    SELECT * FROM visa_info 
    WHERE LOWER(country) LIKE LOWER(?) 
    OR LOWER(visa_type) LIKE LOWER(?) 
    OR LOWER(notes) LIKE LOWER(?)
  `;

  const param = `%${searchTerm}%`;

  // Debugging: log the query and parameters
  console.log('Executing query:', query);
  console.log('With parameter:', param);

  db.all(query, [param, param, param], (err, rows) => {
    if (err) {
      console.error('Error executing query:', err.message); // Log the error message for better clarity
      return res.status(500).json({ error: err.message });
    }

    // Debugging: log the rows returned by the query
    console.log('Query results:', rows);

    // Safely process rows and parse requirements if necessary
    const processedRows = rows.map((row: any) => {
      try {
        // Safely parse requirements and handle potential issues
        const requirements = row.requirements ? JSON.parse(row.requirements) : [];
        return { ...row, requirements };
      } catch (parseError) {
        console.error('Error parsing requirements for row:', row, parseError);
        return { ...row, requirements: [] }; // If parsing fails, return an empty array
      }
    });

    res.json({ data: processedRows });
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Closed the database connection');
    process.exit(0);
  });
});
