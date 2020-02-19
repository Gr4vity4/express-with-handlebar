const express = require("express");
let router = express.Router();

const targetBaseUrl = "http://localhost:3000";

router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

/* GET Method */

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

/* POST Method */

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

module.exports = router;
