import nodemailer from "nodemailer"
import config from "./dotenv.config.js";
import { ApiError } from "../utils/apiError.js";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: config.GOOGLE_USER,
    clientId: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    refreshToken: config.GOOGLE_REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) throw new ApiError(500, `Error connecting to email server:${error.message}`);
  console.log('Email server is ready to send messages');
});

export default transporter;