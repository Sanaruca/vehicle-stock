const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const result = await User.findById(id);
  done(null, result);
});


/////////////////////////////////////////////////////////////////////////////////////////////

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true, //> important
    },

    async (req, email, password, done) => {
      const result = await User.findOne({ email });

      if (result) {
        return done(
          null,
          false,
          req.flash("signUpMessage", "the e-mail is already taken")
        );
      }

      const newUser = new User({
        email,
      });

      newUser.password = newUser.encrypt(password);
      await newUser.save();
      done(null, newUser);
    }
  )
);

/////////////////////////////////////////////////////////////////////////////////////////////////

passport.use(
  "local-signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true, //> important
    },
    async (req, email, password, done) => {
      const result = await User.findOne({ email });

      if (!result)
        return done(
          null,
          false,
          req.flash("signInMessage", "User no registed")
        );

      if (!result.compare_encrypt(password))
        return done(
          null,
          false,
          req.flash("signInMessage", "incorrect password")
        );
      
      done(null, result)
    }
  )
);
