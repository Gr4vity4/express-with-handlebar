const express = require("express");
const app = express();
const port = 3000;
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const routes = require("./routes.js");

mongoose.connect("mongodb://localhost:27017/local");

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
