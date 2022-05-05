const sqlite = require("sqlite3").verbose();
const db = new sqlite.Database(
  "./instruments.db",
  sqlite.OPEN_READWRITE,
  (err) => {
    if (err) console.error(err);
  }
);

// CREATE
// const sql = `CREATE TABLE instruments(id INTEGER PRIMARY KEY, name, price, image, amount)`;

//INSERT
// const sql = `INSERT INTO instruments(name, price, image, amount) VALUES(?,?,?,?)`;

// db.run(sql, [
//   "Klarnet Arnolds&Sons",
//   1409,
//   "klarnet_arnolds&sons.jpg",
//   5,
// ]);


//UPDATE
// const sql = `UPDATE instruments SET amount = ? WHERE id = ?`

// db.run(sql, [5, 6])

//SELECT
// const sql = `SELECT * FROM instruments`

// db.all(sql, (err, rows) => {
//   console.log(rows)
// })

//DELETE
const sql = `DELETE FROM instruments WHERE id=?`

db.run(sql, [7])
