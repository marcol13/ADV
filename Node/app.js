const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");
const bodyParser = require("body-parser");
const session = require("express-session");

const path = require("path");

let shopItems = [];
let buyData = [];

const app = express();
const port = 8003;

const db = new sqlite3.Database(
  "./instruments.db",
  sqlite.OPEN_READWRITE,
  (err) => {
    if (err) console.error(err);
  }
);

app.use(
  session({
    secret: "somesecret",
    cookie: { maxAge: 60 * 60 * 60 },
    saveUninitialized: false,
    resave: false,
  })
);

app.use(bodyParser.json());

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

async function db_all_main() {
  return new Promise(function (resolve, reject) {
    const sql = "SELECT * FROM instruments";
    db.all(sql, (err, rows) => {
      if (err) {
        shopItems = [];
        return reject(err);
      }

      if (rows.length < 1) {
        shopItems = [];
        reject(err);
      }

      shopItems = rows;
      resolve(rows);
    });
  });
}

app.get("/", async (req, res) => {
  try {
    await db_all_main();
  } catch (error) {
    shopItems = [];
  }
  res.render("main", { shopItems: shopItems });
});

app.get("/shopping-cart", (req, res) => {
  if (!req.session.shoppingCart) {
    req.session.shoppingCart = [];
  }
  res.render("shopping-cart", {
    myCart: req.session.shoppingCart,
  });
});

app.post("/add", (req, res) => {
  try {
    const sql = "SELECT * FROM instruments WHERE id=?";
    let amount = 0;
    db.all(sql, [req.body.item], (err, rows) => {
      if (err) res.status(400).send({ status: 400, success: false });

      if (rows.length < 1)
        res.status(400).send({ status: 400, success: false });

      data = rows[0];
      if (req.body.amount <= data.amount) {
        if (req.session.shoppingCart) {
          let index = req.session.shoppingCart.findIndex(
            (el) => el.id === data.id
          );
          if (index > -1) {
            req.session.shoppingCart.splice(index, index + 1);
          }
          req.session.shoppingCart.push({
            id: data.id,
            name: data.name,
            price: data.price,
            amount: data.amount,
            requested: req.body.amount,
          });
        } else {
          req.session.shoppingCart = [
            {
              id: data.id,
              name: data.name,
              price: data.price,
              amount: data.amount,
              requested: req.body.amount,
            },
          ];
        }
        buyData = req.session.shoppingCart;
        console.log(req.session.shoppingCart);
        res.status(200).send({ status: 200, success: true });
      } else {
        res.status(404).send({ status: 400, success: false });
      }
    });
  } catch {
    console.log("nie działa");
  }
});

app.post("/buy", (req, res) => {
  console.log(req.body);
});

app.listen(port);
