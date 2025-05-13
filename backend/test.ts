// Run this in a separate Node.js script or REPL
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { id: '12345', email: 'test@example.com' },
  'your-secret-key', // Make sure this matches process.env.JWT_SECRET
  { expiresIn: '1h' }
);

console.log(token);