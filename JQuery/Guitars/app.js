const express = require("express");
const cors = require("cors")
const data = require("./public/guitars.json");

const port = 5005;

const app = express();

app.get("/guitars", cors(),  (req, res) => {
  console.log(123);
  res.json(data)
});

app.listen(port);
