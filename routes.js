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

  //   let firstName = req.body.first_name;
  //   let lastName = req.body.last_name;
  //   let email = req.body.email;
  //   let password = req.body.password;
  //   let password_confirmation = req.body.password_confirmation;

  //   if (password !== password_confirmation) {
  //     res.cookie("errors", "กรุณาตรวจสอบรหัสผ่านใหม่อีกครั้ง");
  //     res
  //       .cookie("old", {
  //         firstName: firstName,
  //         lastName: lastName,
  //         email: email
  //       })
  //       .redirect(200, "sign-up");
  //   }

  res.send("done.");
});

module.exports = router;
