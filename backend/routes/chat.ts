// src/backend/routes/chat.ts
import express, { Response, NextFunction, Request } from 'express';
import rateLimit from 'express-rate-limit';
import { generateChatResponse } from '../services/chatbot';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from '../middleware/auth'; // Import the auth middleware

const router = express.Router();

// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: "Too many requests, please try again later."
});

// Chat endpoint with authentication and rate limiting middleware
router.post(
  '/message',// First check if the user is authenticated
  apiLimiter, // Then apply rate limiting
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { message, sessionId = uuidv4() } = req.body;

      if (!message) {
        res.status(400).json({ error: "Missing required message field" });
        return;
      }

      // Use the authenticated user information
      const userId = req.userId;
      const userEmail = req.user?.email;

      const response = await generateChatResponse(message);

      console.log(`User ${userId} (${userEmail}) sent message: "${message}"`);

      res.status(200).json({
        response,
        sessionId,
        userId,
        userEmail
      });
    } catch (error) {
      console.error('Chat API error:', error);
      res.status(500).json({
        error: "An error occurred while processing your request"
      });
    }
  }
);

export default router;