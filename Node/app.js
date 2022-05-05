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
    req.session.shopItems = await db_all_main();
  } catch (error) {
    req.session.shopItems = [];
    shopItems = [];
  }
  res.render("main", { shopItems: req.session.shopItems });
});

function checkIsAvailable(cart) {
  let result = [];
  cart.forEach((el, index) => {
    const sql = "SELECT amount FROM instruments WHERE id=?";
    db.all(sql, [el.id], (err, rows) => {
      if (err) return;

      if (rows.length < 1) return;

      el.amount = rows[0].amount;
      if (el.requested > el.amount) el.isAvailable = false;
      console.log(el);
      result.push(el);
      if (index == cart.length - 1) return result;
    });
  });
}

app.get("/shopping-cart", (req, res) => {
  let canBuy = true;
  if (!req.session.shoppingCart || req.session.shoppingCart.length < 1) {
    req.session.shoppingCart = [];
    res.render("shopping-cart", {
      myCart: req.session.shoppingCart,
      canBuy: canBuy,
    });
  } else {
    console.log("abc");
    // req.session.shoppingCart = checkIsAvailable(req.session.shoppingCart);
    req.session.shoppingCart.forEach((el, index) => {
      const sql = "SELECT amount FROM instruments WHERE id=?";
      db.all(sql, [el.id], (err, rows) => {
        if (err) return;

        if (rows.length < 1) return;

        el.amount = rows[0].amount;
        if (el.requested > el.amount) {
          el.isAvailable = false;
          canBuy = false;
        }

        if (index == req.session.shoppingCart.length - 1) {
          res.render("shopping-cart", {
            myCart: req.session.shoppingCart,
            canBuy: canBuy,
          });
        }
      });
    });
  }
  // console.log(`siema ${req.session.shoppingCart}`);
  // res.render("shopping-cart", {
  //   myCart: req.session.shoppingCart,
  //   canBuy: canBuy,
  // });
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
            isAvailable: true,
          });
        } else {
          req.session.shoppingCart = [
            {
              id: data.id,
              name: data.name,
              price: data.price,
              amount: data.amount,
              requested: req.body.amount,
              isAvailable: true,
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

function inStock(cart) {
  let sql = "";
  cart.forEach((el) => {
    sql = "SELECT amount FROM instruments WHERE id=?";
    db.all(sql, [el.id], (err, rows) => {
      if (err) return false;

      if (rows.length < 1) return false;

      let data = rows[0].amount;

      if (data < cart.requested) {
        return false;
      }
    });
  });
  return true;
}

app.post("/buy", (req, res) => {
  const cart = req.session.shoppingCart;
  if (inStock(cart)) {
    db.run("BEGIN TRANSACTION");
    cart.forEach((el, index) => {
      const sql = "UPDATE instruments SET amount = amount - ? WHERE id=?";
      db.run(sql, [el.requested, el.id], (err, rows) => {
        if (err) res.status(400).send({ status: 400, success: false });
        if (index == cart.length - 1) {
          db.run("COMMIT;");
          req.session.shoppingCart = [];
          res.status(200).send({ status: 200, success: true });
        }
      });
    });
  }
});

app.listen(port);
