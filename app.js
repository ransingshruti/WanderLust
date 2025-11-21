if(process.env.NODE_ENV !="production"){
  require('dotenv').config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path")
const port=8080;

//mongoose Connections
const dbUrl=process.env.ATLASDB_URL
mongoose.connect(dbUrl).then(()=>{
    console.log("mongoose connected")
}).catch((err)=>{
    console.log(err)
})

const ejsMate=require("ejs-mate")
const methodOverride=require("method-override")

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ejs and ejs mate set up
app.set("view engine","ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views"));

// public folder
app.use(express.static(path.join(__dirname, "/public")));

// method override
app.use(methodOverride("_method"))
//models
const Listing=require("./models/listing");
const Review=require("./models/reviews");
const User=require("./models/user")
// wrapasync
const wrapAsync=require("./utils/wrapAsync");
const ExpressError=require("./utils/ExpressError");



// Sessions
 const session=require("express-session");

 const MongoStore = require("connect-mongo");

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600
});

store.on("error", (err) => {
    console.log("SESSION STORE ERROR:", err);
});

app.use(session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}));


// flash
const flash=require("connect-flash");
app.use(flash())
// middleware fir flash-connect


// passport
const passport=require("passport");
const LocalStrategy=require("passport-local");
// use
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})

// Routers:
const listingRoute=require("./router/listings");
const reviewRoute=require("./router/reviews");
const userRoute=require("./router/user")
app.use("/listings/:id/reviews", reviewRoute);
app.use("/listings", listingRoute);
app.use("/",userRoute)

app.get("/", async (req, res) => {
   const listings = await Listing.find();
  res.render("listings/allListings", { listings });
});

// Catch-all route for 404 (MUST be at the end, before error handler)
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Centralized error-handling middleware
  app.use((err, req, res, next) => {
      // console.log("FULL ERROR:", err);
  const { statusCode = 500, message = "Something went wrong!" } = err;
//   res.status(statusCode).send(message);
res.render("error",{message})
});

app.listen(port,(req,res)=>{
    console.log("App Started on port ",port)
});
