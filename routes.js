const express = require("express");
const jwt = require("jwt-simple");
require("dotenv").config();
const env = process.env;
var router = express.Router();
const HomeController = require("./controllers/HomeController");
const PostController = require("./controllers/PostController");

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
  new JwtStrategy(jwtOptions, function(payload, done) {
    if (payload.sub === "success") {
      done(null, true);
    } else {
      done(null, false);
    }
  })
);

const requireJWTAuth = passport.authenticate("jwt", { session: false });

/* ===== GET Methods ===== */

router.get("/", function(req, res) {
  HomeController.home(req, res);
});

router.get("/sign-up", function(req, res) {
  HomeController.sign_up(req, res);
});

router.get("/sign-in", function(req, res) {
  HomeController.sign_in(req, res);
});

router.get("/welcome", requireJWTAuth, function(req, res) {
  HomeController.welcome(req, res);
});

router.get("/logout", function(req, res) {
  HomeController.logout(req, res);
});

router.get("/course/:courseId", function(req, res) {
  HomeController.course(req, res);
});

/* ===== POST Methods ===== */

router.post("/sign-up", function(req, res) {
  PostController.sign_up(req, res);
});

router.post("/sign-in", function(req, res) {
  PostController.sign_in(req, res);
});

module.exports = router;
