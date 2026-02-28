const router = require("express").Router()
require("dotenv").config();

//Import passport for auithentication
const passport = require('passport');

// import session from express session 
const session = require('express-session');
const { route } = require("./UserFetch");

const FRONTEND_URL=process.env.FRONTEND_URL
const BACKEND_URL=process.env.BACKEND_URL

var GoogleStrategy = require('passport-google-oauth20').Strategy;

//cors initialization
const cors=require("cors")
router.use(
  cors({
    origin: `${FRONTEND_URL}`,
    credentials: true,
  })
);


//initializing passport:
router.use(passport.initialize());

//tell your passport to use session
router.use(passport.session())

//using useModel for checking exixstance of the user
const {UsersModel}=require('../database/models.js')

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        const user = await UsersModel.findOne({ email });

        if (!user) {
          return done(null, false);
        }

        //  user exists
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// serialize and deserialize using details of user
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UsersModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

router.get('/',(req , res)=>{
    res.send("<a href='/auth/google'>Login with Google</a>");
});

router.get('/google',
    passport.authenticate('google',{scope:['profile','email']}));
    router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND_URL}/?error=invalid_user`,
    successRedirect: `${FRONTEND_URL}/profile`,
  })
);

router.get('/profile', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json({
  id:req.user._id,
  name: req.user.name,
  email: req.user.email,
  role: req.user.role
});
});

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    req.session.destroy(() => {
      res.clearCookie("ims.sid", {
  secure: true,
  sameSite: "none",
}); // remove session cookie
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

  module.exports=router;
