import userModel from "../model/user.model.js";
import { ApiError } from "../utils/apiError.js";
import crypto from "crypto"
import { generateToken, verifyToken } from "../utils/generateToken.js";
import config from "../config/dotenv.config.js"
import sessionModel from "../model/session.model.js";
import { sendVerificationEmail } from "../utils/sendVerificationEmail.js";
import { findUser } from "../utils/findUser.js";

/**
 * Register a new user
 * @param {Object} data
 * @param {string} data.fullname
 * @param {string} data.email
 * @param {string} data.password
 * @param {Object} data.mobileNo
 * @param {string} data.mobileNo.countryCode
 * @param {string} data.mobileNo.number
 * @returns {Promise<Object>}
 */
export const registerLogic = async (data) => {

  const { fullname, email, password, mobileNo } = data

  // =====================================================
  // CHECK IF USER ALREADY EXISTS
  // =====================================================

  const existingUser = await userModel.findOne({
    $or: [
      { email },
      { "mobileNo.number": mobileNo.number },
    ],
  });

  // =====================================================
  // DUPLICATE EMAIL CHECK
  // =====================================================
  if (existingUser) {
    if (existingUser.email === email) {
      throw new ApiError(409, "Email already registered");
    }

    if (existingUser.mobileNo.number === mobileNo.number) {
      throw new ApiError(409, "Mobile number already registered");
    }
  }

  // =====================================================
  // CREATE USER
  // =====================================================

  const user = await userModel.create({
    fullname,
    email,
    password,
    mobileNo: {
      countryCode: mobileNo.countryCode,
      number: mobileNo.number,
    },
  });

  // =====================================================
  // Without Password USER
  // =====================================================
  const newUser = {
    id: user._id,
    fullname: user.fullname,
    email: user.email,
    mobileNo: user.mobileNo,
  }

  // =====================================================
  // EMAIL VERIFICATION TOKEN
  // =====================================================
  const emailToken = generateToken(newUser.id, null, config.EMAIL_VERIFICATION_SECRET, config.EMAIL_VERIFICATION_EXPIRY)


  // =====================================================
  // VERIFICATION LINK
  // =====================================================

  const verificationLink = `${config.FRONTEND_URL}/api/auth/verify-email/${emailToken}`
  await sendVerificationEmail(user.email, verificationLink)

  return newUser;
};

export const loginLogic = async (data, req) => {

  const { email, password } = data

  // =====================================================
  // FIND USER
  // =====================================================

  const user = await findUser({ email })

  // console.log(user.password)

  if (!user.isVerified) {
    throw new ApiError(
      403,
      "Account is not verified"
    );
  }

  // =====================================================
  // VERIFY PASSWORD
  // =====================================================

  const isPasswordValid =
    await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(
      401,
      "Invalid password"
    );
  }

  // =====================================================
  // UPDATE LAST LOGIN
  // =====================================================

  user.lastLogin = new Date();

  await user.save({
    validateBeforeSave: false,
  });

  // =====================================================
  // CREATE EMPTY SESSION
  // =====================================================

  const session = await sessionModel.create({
    user: user._id,

    refreshToken: "pending",

    ipAddress:
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress,

    userAgent:
      req.headers["user-agent"],

    expiresAt: new Date(
      Date.now() +
      7 * 24 * 60 * 60 * 1000
    ),
  });

  // =====================================================
  // GENERATE TOKENS
  // =====================================================

  const refreshToken = generateToken(
    user._id,
    session._id,
    config.REFRESH_TOKEN_SECRET,
    config.REFRESH_TOKEN_EXPIRY
  );

  const accessToken = generateToken(
    user._id,
    session._id,
    config.ACCESS_TOKEN_SECRET,
    config.ACCESS_TOKEN_EXPIRY
  );

  // =====================================================
  // SAVE REAL REFRESH TOKEN
  // =====================================================

  session.refreshToken = refreshToken;

  await session.save();

  // =====================================================
  // SAFE USER
  // =====================================================

  const loggedInUser = {
    id: user._id,
    mobileNo: user.mobileNo,
    avatar: user.avatar,
    role: user.role,
    fullname: user.fullname,
    email: user.email,
  };

  return {
    loggedInUser,
    accessToken,
    refreshToken,
  };
};


export const verifyEmailLogic = async ({ token }) => {

  if (!token) throw new ApiError(400, "Token is required");

  const decoded = verifyToken(token, config.EMAIL_VERIFICATION_SECRET)

  const user = await findUser({
    _id: decoded.id
  });

  if (user.isVerified) throw new ApiError(400, "Email already verified");

  user.isVerified = true
  await user.save()

  return

}


export const refreshTokenLogic = async ({ token }) => {

  if (!token) throw new ApiError(401, "Refresh token not found");

  const decoded = await verifyToken(token, config.REFRESH_TOKEN_SECRET)
  // console.log(decoded)

  const user = await findUser({ _id: decoded.id })

  const session = await sessionModel.findOne({
    _id: decoded.sessionid,
    user: decoded.id,
    revoked: false
  })

  if (!session) throw new ApiError(404, "session not found");

  session.lastUsedAt = new Date()
  await session.save()

  const accessToken = await generateToken(user._id, session._id, config.ACCESS_TOKEN_SECRET, config.ACCESS_TOKEN_EXPIRY)

  const loggedInUser = {
    id: user._id,
    avatar: user.avatar,
    role: user.role,
    email: user.email,
    fullname: user.fullname,
    isVerified: user.isVerified,
    lastLogin: user.lastLogin
  }

  return { loggedInUser, accessToken }

}

export const googleLoginLogic = async (profile) => {
  const email = profile.emails?.[0]?.value;

  let user = await userModel.findOne({ email })


  if (!user) {
    user = await userModel.create({
      email,
      googleId: profile.id,
      fullname: profile.displayName,
      lastLogin: new Date(),
      avatar: profile.photos?.[0]?.value,
      authProvider: "google",
      isVerified: true,
    })
  }


  return user
}