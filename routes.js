const express = require("express");
let router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

/* GET Method */

router.get("/", function(req, res) {
  res.render("home");
});

router.get("/sign-up", function(req, res) {
  res.render("sign_up");
});

/* POST Method */

router.post("/sign-up", function(req, res) {
  console.log(req.body);
  res.send("done.");
});

module.exports = router;
