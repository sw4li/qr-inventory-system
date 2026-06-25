import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { testConnection } from './config/db.js';
import itemRoutes from "./routes/item.js";
import transactionRoutes from './routes/transactions.js';
import qrCodeRoutes from './routes/qrCode.js';
import authRoutes from './routes/auth.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow cross-origin requests from Angular
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Test database connection on startup
testConnection();


// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'QR Inventory API',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use("/api/items", itemRoutes);
app.use('/api/transactions',transactionRoutes);
app.use("/api/qr", qrCodeRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
