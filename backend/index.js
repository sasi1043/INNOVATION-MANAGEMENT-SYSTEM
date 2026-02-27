require("dotenv").config()

const express = require('express')
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(express.json());

app.use(cors({
 origin: FRONTEND_URL,
 credentials: true
}));

app.set("trust proxy", 1);

// initializing session
app.use(session({
 secret: "secret",
 resave: false,
 saveUninitialized: false,
 cookie: {
   secure: false,   // localhost
   sameSite: "lax"
 }
}));

// initializing passport
app.use(passport.initialize());
app.use(passport.session());


//Connecting To DB
const connectDB = require('./db.js');
connectDB();

// for fetching backend pdf files
const path = require("path");

app.use(
  "/ideafiles",
  express.static(path.join(__dirname, "ideafiles"))
);

const Googles = require('./Routes/GoogleSign.js')
// For Google authentication
app.use('/auth',Googles)

//For adding USER  
const adduser=require('./Routes/UserFetch.js')
app.use('/user',adduser);

//For Creating Challenges
const challenge = require('./fetchData/Challenge.js')
app.use('/challenge' , challenge)

//For Idea Submission 
const Idea = require('./fetchData/Idea.js');
app.use('/ideas',Idea)

//Server Running in the 4000 Port
app.listen(4000,()=>console.log("app is running in http://localhost:4000"));