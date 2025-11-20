const User=require("../models/user")
module.exports.renderSignupForm=(req,res)=>{
    res.render("./users/signup")
};

// controllers/users.js

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    // Fix: wrap req.login with Promise
    await new Promise((resolve, reject) => {
      req.login(registeredUser, err => {
        if (err) return reject(err);
        resolve();
      });
    });

    req.flash("success", "Welcome to WanderLust");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    delete req.session.redirectUrl;  // clear session
    return res.redirect(redirectUrl);

  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("/signup");
  }
};




module.exports.renderLoginForm=(req,res)=>{
    res.render("./users/login")
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome to WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    delete req.session.redirectUrl; // clear redirect
    return res.redirect(redirectUrl);
};


module.exports.logout= (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are loggedout");
        res.redirect("/listings")
    });
}