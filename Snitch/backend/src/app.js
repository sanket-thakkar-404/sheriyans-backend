import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import ErrorHandler from "./middleware/error.middleware.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import passport from "./config/passport.config.js";

// =====================================================
// RECREATE __dirname FOR ES MODULES
// =====================================================
// Node.js ES Modules do not provide __dirname automatically.
// This recreates it so we can use path.join() and sendFile().

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================================================
// CREATE EXPRESS APPLICATION
// =====================================================
const app = express();

// =====================================================
// GLOBAL MIDDLEWARES
// =====================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"))
app.use(cookieParser())
app.use(passport.initialize())


// =====================================================
// APPLICATION ROUTES
// =====================================================

// Auth Routes
import authRoutes from "./routes/auth.routes.js";



// Auth Apis
app.use("/api/auth", authRoutes);

// =====================================================
// 404 NOT FOUND HANDLER
// =====================================================

/**
 * Catch all undefined routes and return a custom 404 HTML page.
 * IMPORTANT:
 */
// app.use("*name", (req, res) => {
//   return res.status(404).sendFile(
//     path.join(__dirname, "../public", "404.html")
//   );
// });

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================
/**
 * Handles all application errors in one centralized place.
 * MUST be the last middleware in the application.
 */
app.use(ErrorHandler);

// =====================================================
// EXPORT APPLICATION
// =====================================================

export default app;