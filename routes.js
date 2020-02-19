const express = require("express");
const jwt = require("jwt-simple");
require("dotenv").config();
const env = process.env;
let router = express.Router();
const targetBaseUrl = env.APP_URL;

const passport = require("passport");
const ExtractJwt = require("passport-jwt").ExtractJwt; // decode jwt
const JwtStrategy = require("passport-jwt").Strategy;

var cookieExtractor = function(req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

const jwtOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: env.JWT_SECRET_KEY
};

passport.use(
  new JwtStrategy(jwtOptions, (payload, done) => {
    if (payload.sub === "success") {
      done(null, true);
    } else {
      done(null, false);
    }
  })
);

const requireJWTAuth = passport.authenticate("jwt", { session: false });

/* ===== GET Method ===== */

router.get("/", function(req, res) {
  res.render("home");
});

router.get("/sign-up", function(req, res) {
  const form = {
    firstName: req.cookies.old !== undefined ? req.cookies.old.firstName : "",
    lastName: req.cookies.old !== undefined ? req.cookies.old.lastName : "",
    email: req.cookies.old !== undefined ? req.cookies.old.email : ""
  };

  const errors = {
    password:
      req.cookies.errors !== undefined ? req.cookies.errors.password : ""
  };

  res.render("sign_up", { form: form, errors: errors });
  res.clearCookie("old");
  res.clearCookie("errors");
});

router.get("/sign-in", function(req, res) {
  res.render("sign_in");
});

router.get("/welcome", requireJWTAuth, function(req, res) {
  res.render("welcome", { _token: req.cookies._token });
});

router.get("/logout", function(req, res) {
  res.clearCookie("jwt");
  res.redirect(`${targetBaseUrl}/`);
});

/* ===== POST Method ===== */

router.post("/sign-up", function(req, res) {
  let firstName = req.body.first_name;
  let lastName = req.body.last_name;
  let email = req.body.email;
  let password = req.body.password;
  let password_confirmation = req.body.password_confirmation;

  if (password !== password_confirmation) {
    console.log(">>> passwords does not match.");
    res.cookie("errors", {
      password: "กรุณาตรวจสอบรหัสผ่านใหม่อีกครั้ง"
    });
    res.cookie("old", {
      firstName: firstName,
      lastName: lastName,
      email: email
    });
    res.redirect(`${targetBaseUrl}/sign-up`);
  }

  res.send("done.");
});

router.post("/sign-in", function(req, res) {
  let email = req.body.email;
  let password = req.body.password;

  if (email === "test@test.com" && password === "1234") {
    const payload = {
      sub: "success",
      iat: new Date().getTime()
    };
    res.cookie("jwt", jwt.encode(payload, env.JWT_SECRET_KEY));
    res.redirect(`${targetBaseUrl}/welcome`);
  }

  res.redirect(`${targetBaseUrl}/sign-in`);
});

module.exports = router;
