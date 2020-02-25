const jwt = require("jwt-simple");
require("dotenv").config();
const env = process.env;
const targetBaseUrl = process.env.APP_URL;
var userSchema = require("../schema/user");
var courseSchema = require("../schema/course");
const mongodbCloud = require("../mongodb-cloud");
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

  mongodbCloud.connect(function(err) {
    mongodbCloud
      .db(process.env.DB_NAME)
      .collection("users")
      .insertOne(
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password
        },
        function(err) {
          res.redirect(`${targetBaseUrl}/sign-in`);
        }
      );
  });
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
    var found = false;
    mongodbCloud.connect(function(err) {
      mongodbCloud
        .db(process.env.DB_NAME)
        .collection("users", function(err, collection) {
          collection.find({ email: email, password: password }, function(
            err,
            items
          ) {
            items
              .forEach(function(item) {
                found += true;
              })
              .then(function() {
                if (found) {
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
          });
        });
    });
  }
}

function courses_manage_edit(req, res) {
  const slug = req.params.slug;
  const body = req.body;

  mongodbCloud.connect(function(err) {
    mongodbCloud
      .db(process.env.DB_NAME)
      .collection("courses", function(err, collection) {
        collection.updateOne(
          { slug: slug },
          {
            $set: {
              title: body.title,
              description: body.description,
              price: body.price,
              author: body.author
            }
          }
        );

        res.redirect(`${targetBaseUrl}/courses-manage`);
      });
  });
}

function courses_manage_create(req, res) {
  var latestId = 1;
  const body = req.body;

  mongodbCloud.connect(function(err) {
    mongodbCloud
      .db(process.env.DB_NAME)
      .collection("courses")
      .aggregate([{ $sort: { _id: -1 } }, { $limit: 1 }], function(err, items) {
        items
          .forEach(function(item) {
            latestId += item.id;
          })
          .then(function() {
            mongodbCloud
              .db(process.env.DB_NAME)
              .collection("courses")
              .insertOne({
                id: latestId,
                title: body.title,
                description: body.description,
                price: body.price,
                author: body.author,
                slug: slug(body.title.toLowerCase())
              });

            res.redirect(`${targetBaseUrl}/courses-manage`);
          });
      });
  });
}

function courses_manage_delete(req, res) {
  mongodbCloud
    .db(process.env.DB_NAME)
    .collection("courses")
    .deleteOne({ slug: req.params.slug }, function(err) {
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
