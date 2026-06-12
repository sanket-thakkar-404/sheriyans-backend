import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import config from "./dotenv.config.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { googleLoginLogic } from "../services/auth.service.js"

console.log("GOOGLE_CALLBACK_URL =", config.GOOGLE_CALLBACK_URL);


passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await googleLoginLogic(profile)
        return done(null, user)
      } catch (error) {
        return done(error, null)
      }
    }
  )
)


export default passport