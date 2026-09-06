/**
 * Cyber Guardian AI — Configuration (Node.js)
 * No AI provider. Pure deterministic analysis.
 */
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

export const config = {
  port: parseInt(process.env.PORT || '8000', 10),
  host: process.env.HOST || '0.0.0.0',

  // CORS allowed origins
  corsOrigins: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:5713',
  ],

  // File upload
  maxFileSizeMB: 10,
  allowedImageTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
};
