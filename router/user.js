const express=require("express");
const router=express.Router();
const User=require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware")

const userController=require("../controllers/users")

// signup

router.route("/signup")
.get(saveRedirectUrl,userController.renderSignupForm)
.post(saveRedirectUrl,wrapAsync(userController.signup))

// login
router.route("/login")
.get(saveRedirectUrl,userController.renderLoginForm)
.post(
  
  saveRedirectUrl, // <-- first store redirect URL
  passport.authenticate('local', {
    failureRedirect: "/login",
    failureFlash: true
  }),
  userController.login
);

// signup
// router.get("/signup",saveRedirectUrl,userController.renderSignupForm);

// router.post("/signup",saveRedirectUrl,wrapAsync(userController.signup))

// login

// router.get("/login",saveRedirectUrl,userController.renderLoginForm);

// router.post(
//   "/login",
//   saveRedirectUrl, // <-- first store redirect URL
//   passport.authenticate('local', {
//     failureRedirect: "/login",
//     failureFlash: true
//   }),
//   userController.login
// );


// logout
router.get("/logout",userController.logout);
module.exports=router;