const jwt = require("jwt-simple");
require("dotenv").config();
const env = process.env;
const targetBaseUrl = process.env.APP_URL;
var userSchema = require("../schema/user");

function sign_up(req, res) {
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

  // save user data
  var userData = new userSchema({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password
  });

  userData.save(function(err, user) {
    if (err) return console.log(err);
    console.log(user.firstName + " saved to users collection");
  });

  res.redirect(`${targetBaseUrl}/sign-in`);
}

function sign_in(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const query = userSchema.find({ email: email, password: password }, function(
    err,
    documents
  ) {
    if (documents.length > 0) {
      const payload = {
        sub: "success",
        iat: new Date().getTime()
      };
      res.cookie("jwt", jwt.encode(payload, env.JWT_SECRET_KEY));
      res.redirect(`${targetBaseUrl}/welcome`);
    } else {
      res.redirect(`${targetBaseUrl}/sign-in`);
    }
  });
}

const PostController = {
  sign_up,
  sign_in
};

module.exports = PostController;
