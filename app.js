// modules
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

// imports
import authRoutes from "./routers/authRouters.js";
import homeRouters from "./routers/homeRouters.js";
import portfoiloRouters from "./routers/portfoiloRouters.js";
import userRouters from "./routers/user.js";

const app = express();
const url = process.env.API_URL || "/api/v1";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(helmet());
app.use(limiter);
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Static images
app.use(
  `${url}/images/portfolio`,
  express.static(path.join(__dirname, "images", "portfolio"))
);
app.use(
  "/images/portfolio",
  express.static(path.join(__dirname, "images", "portfolio"))
);
app.use(
  `${url}/images`,
  express.static(path.join(__dirname, "images"))
);
app.use(
  "/images",
  express.static(path.join(__dirname, "images"))
);

// Routes
app.use(`${url}/auth`, authRoutes);
app.use(`${url}/home`, homeRouters);
app.use(`${url}/portfolio`, portfoiloRouters);
app.use(`${url}/portfoilo`, portfoiloRouters); // Backwards compatibility for typo
app.use(`${url}/user`, userRouters);

// API status & info route
app.get(`${url}`, (req, res) => {
  res.status(200).json({
    name: "SuperMarket API",
    version: "1.0.0",
    status: "active",
    endpoints: {
      auth: `${url}/auth`,
      home: `${url}/home`,
      user: `${url}/user`,
      portfolio: `${url}/portfolio`,
    },
  });
});

// Root welcome route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the SuperMarket API",
    apiPrefix: url,
    documentation: `${url}`,
  });
});

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;