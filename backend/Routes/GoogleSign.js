// routes/auth.js
const router = require("express").Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cors = require("cors");
require("dotenv").config();

const { UsersModel } = require("../database/models.js");
const FRONTEND_URL = process.env.FRONTEND_URL;
const BACKEND_URL = process.env.BACKEND_URL;

router.use(cors({ origin: FRONTEND_URL, credentials: true }));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value.toLowerCase();
        const user = await UsersModel.findOne({ email });

        if (!user) return done(null, false); // Invalid user
        return done(null, user); // User exists
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UsersModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Start Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${FRONTEND_URL}/?error=invalid_user` }),
  (req, res) => {
    if (!req.user) return res.redirect(`${FRONTEND_URL}/?error=invalid_user`);

    console.log("Google Sign-In user:", req.user);

    // Send user info to frontend as query params
    res.redirect(
      `${FRONTEND_URL}/profile?uid=${req.user._id}&role=${req.user.role}&name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(req.user.email)}`
    );
  }
);

module.exports = router;