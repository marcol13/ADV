const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const path = require("path");

const app = express();
const port = 8003;

app.use(express.static("public"));

app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);

app.use(expressLayouts);
app.set("layout", "./layout");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("main");
});

app.get("/shopping-cart", (req, res) => {
  res.render("shopping-cart", {
    myCart: [{ item: "Gitara", amount: 3, price: 500 }, {item: "Ukulele", amount: 4, price: 200}],
  });
});

app.listen(port);
