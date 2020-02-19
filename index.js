const express = require("express");
const app = express();
const port = 3000;
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const routes = require("./routes.js");
require("dotenv").config();
const env = process.env;

mongoose.connect(`mongodb://${env.DB_HOST}:${env.DB_PORT}/${env.DB_DATABASE}`);

console.log(mongoose);

app.set("view engine", "hbs");
app.engine(
  "hbs",
  handlebars({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    extname: "hbs",
    defaultLayout: "index"
  })
);

app.use(express.static("public"));
app.use("/", routes);

app.listen(port, () => {
  console.log(`App listening to port ${port}`);
});
