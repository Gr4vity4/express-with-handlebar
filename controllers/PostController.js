const jwt = require("jwt-simple");
require("dotenv").config();
const env = process.env;
const targetBaseUrl = process.env.APP_URL;
var userSchema = require("../schema/user");
var courseSchema = require("../schema/course");
var slug = require("slug");

function sign_up(req, res) {
  const firstName = req.body.first_name;
  const lastName = req.body.last_name;
  const email = req.body.email;
  const password = req.body.password;
  const password_confirmation = req.body.password_confirmation;

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

  /* Demo Admin Account */
  if (email === "admin@admin.com" && password === "12345678") {
    const payload = {
      sub: "admin",
      iat: new Date().getTime()
    };
    res.cookie("jwt", jwt.encode(payload, env.JWT_SECRET_KEY));
    res.redirect(`${targetBaseUrl}/courses-manage`);
  } else {
    const query = userSchema.find(
      { email: email, password: password },
      function(err, documents) {
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
      }
    );
  }
}

function courses_manage_edit(req, res) {
  const slug = req.params.slug;
  const body = req.body;
  courseSchema.updateOne(
    { slug: slug },
    {
      title: body.title,
      description: body.description,
      price: body.price,
      author: body.author
    },
    { new: true },
    function(err, document) {
      res.redirect(`${targetBaseUrl}/courses-manage`);
    }
  );
}

function courses_manage_create(req, res) {
  const body = req.body;

  courseSchema
    .find()
    .sort({ _id: -1 })
    .limit(1)
    .exec(function(err, data) {
      var latestId = 0;
      if (err) {
        console.log(err);
      } else {
        const result = JSON.parse(JSON.stringify(data));

        if (result[0] !== undefined) {
          latestId = result[0].id + 1;
        } else {
          latestId = 1;
        }
      }

      // create new course
      courseSchema({
        id: latestId,
        title: body.title,
        description: body.description,
        price: body.price,
        author: body.author,
        slug: slug(body.title.toLowerCase())
      }).save();
      res.redirect(`${targetBaseUrl}/courses-manage`);
    });
}

function courses_manage_delete(req, res) {
  courseSchema.deleteOne({ slug: req.params.slug }, function(err) {
    res.redirect(`${targetBaseUrl}/courses-manage`);
  });
}

const PostController = {
  sign_up,
  sign_in,
  courses_manage_edit,
  courses_manage_create,
  courses_manage_delete
};

module.exports = PostController;
