require("dotenv").config();

const targetBaseUrl = process.env.APP_URL;

function home(req, res) {
  res.render("home");
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
  res.render("welcome", { _token: req.cookies._token });
}

function logout(req, res) {
  res.clearCookie("jwt");
  res.redirect(`${targetBaseUrl}/`);
}

const HomeController = {
  home,
  sign_up,
  sign_in,
  welcome,
  logout
};

module.exports = HomeController;
