const express = require("express");
let router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

router.get("/", function(req, res) {
  res.render("home");
});

router.get("/sign-up", function(req, res) {
  res.render("sign_up");
});

module.exports = router;
