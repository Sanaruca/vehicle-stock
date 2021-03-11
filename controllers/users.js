const passport = require("passport");

exports.get_signUp = (req, res, next) => {
  res.render("signUp_form");
}

exports.post_signUp = passport.authenticate("local-signup", {
  successRedirect: "/",
  failureRedirect: "/signUp",
  passReqToCallback: true,
});

exports.get_signIn = (req, res, next) => {
  res.render("signIn_form");
}

exports.post_signIn = passport.authenticate("local-signin", {
  successRedirect: "/",
  failureRedirect: "/signIn",
  passReqToCallback: true,
});

////////////////////////////////////////////////////////////////////////////////////

exports.get_logOut = (req, res) => { 
  req.logout();  
  res.redirect("/");
}