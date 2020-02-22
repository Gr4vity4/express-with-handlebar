const express = require("express");
const app = express();
const port = 3000;
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const routes = require("./routes.js");
require("dotenv").config();
const env = process.env;
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var methodOverride = require("method-override");
var slug = require("slug");

// parse application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  methodOverride(function(req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

mongoose.connect(`mongodb://${env.DB_HOST}:${env.DB_PORT}/${env.DB_DATABASE}`);

app.set("view engine", "hbs");
app.engine(
  "hbs",
  handlebars({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    extname: "hbs",
    defaultLayout: "index",
    helpers: {
      toLowerCase: function(str) {
        return str.toLowerCase();
      },
      urlLowerCase: function(str) {
        return slug(str.toLowerCase());
      },
      numberFormat: function(value) {
        return new Intl.NumberFormat("th-TH", {
          style: "currency",
          currency: "THB"
        }).format(value);
      }
    }
  })
);

app.use(express.static("public"));
app.use("/", routes);

app.listen(port, function() {
  console.log(`App listening to port ${port}`);
});
