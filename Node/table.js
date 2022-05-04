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
const sql = `INSERT INTO instruments(name, price, image, amount) VALUES(?,?,?,?)`;

db.run(sql, [
  "Kazoo metalowe",
  16,
  "metalowe_kazoo.jpg",
  0,
]);
