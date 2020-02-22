require("dotenv").config();
const courseSchema = require("../schema/course");

const targetBaseUrl = process.env.APP_URL;

/* ===== Auth ===== */
function userAuth(req) {
  const jwt = require("jwt-simple");

  if (req.cookies.jwt === undefined) {
    return false;
  }

  const status = jwt.decode(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  if (status.sub === "success") {
    return true;
  } else {
    return false;
  }
}
/* ================ */

function home(req, res) {
  courseSchema.find({}, function(err, documents) {
    res.render("home", {
      login: userAuth(req),
      courses: JSON.parse(JSON.stringify(documents))
    });
  });
}

function sign_up(req, res) {
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
}

function sign_in(req, res) {
  res.render("sign_in");
}

function welcome(req, res) {
  res.render("welcome", { _token: req.cookies._token, login: userAuth(req) });
}

function logout(req, res) {
  res.clearCookie("jwt");
  res.redirect(`${targetBaseUrl}/`);
}

function course(req, res) {
  var info = {};
  var docs = {};

  courseSchema.find({}, function(err, documents) {
    docs = JSON.parse(JSON.stringify(documents));

    docs.forEach(function(doc) {
      if (doc.slug === req.params.title) {
        info = doc;
      }
    });

    console.log(info);
    res.render("course", {
      login: userAuth(req),
      courses: docs,
      info: info
    });
  });
}

function course_manage(req, res) {
  res.render("course_manage");
}

const HomeController = {
  home,
  sign_up,
  sign_in,
  welcome,
  logout,
  course,
  course_manage
};

module.exports = HomeController;
