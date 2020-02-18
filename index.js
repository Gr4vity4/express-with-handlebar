const express = require("express");
const app = express();
const port = 3000;
const handlebars = require("express-handlebars");

const http = require("http");
const io = require("socket.io")(http.createServer().listen(8080));

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

app.listen(port, () => {
  console.log(`App listening to port ${port}`);
});

io.on("connection", client => {
  console.log("new connection");

  client.emit("ch1", "welcome");

  client.on("chat message", function(msg) {
    console.log("message: " + msg);
  });

  client.on("event", data => {});
  client.on("disconnect", () => {});
});

app.get("/", (req, res) => {
  console.log("route /");

  res.render("main");
});
