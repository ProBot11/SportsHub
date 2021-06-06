const express = require("express");

const router = express.Router();
const mysql = require("mysql2/promise");
const connection = require("../model/connection");

router.get("/", async (req, res) => {
  let booking = [];
  const con = await mysql.createConnection({
    host: `${process.env.HOST}`,
    user: `${process.env.USER_DB}`,
    password: `${process.env.PASSWORD}`,
    database: `${process.env.DB_NAME}`,
  });

  const query = `SELECT location, COUNT(*) AS count FROM Ground GROUP BY location`;
  // SELECT COUNT ( DISTINCT location ) AS "nloc" FROM Ground

  // const [rows, fields] = await con.execute(query);
  connection.query(`SELECT * FROM Booking`, async (err, bookings, _fields) => {
    if (err) throw err;
    else {
      connection.query(
        `SELECT * FROM Ground INNER JOIN Staff ON Ground.StaffId = Staff.Sid`,
        async (err, ground, _f) => {
          if (err) throw err;
          else {
            booking = bookings;
            res.render("admin", {
              msg: { msg: null, flag: true },
              booking,
              ground,
            });
          }
        }
      );
    }
  });
});

router.post("/staff", async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  connection.query(
    `INSERT INTO Staff(firstName, lastName, email, password, phone,role) VALUES('${firstName}','${lastName}','${email}','${password}','${phone}',1)`,
    async (err, results, fields) => {
      if (err) {
        console.log("Error: " + err);
        let booking = [];
        connection.query(
          `SELECT * FROM Booking`,
          async (erro, bookings, _fields) => {
            if (erro) {
              throw erro;
            } else {
              connection.query(
                `SELECT * FROM Ground`,
                async (errx, ground, _f) => {
                  if (errx) throw errx;
                  else {
                    booking = bookings;
                    // console.log(ground);
                    res.render("admin", {
                      msg: { msg: err, flag: false },
                      booking,
                      ground,
                    });
                  }
                }
              );
            }
          }
        );
      } else {
        let booking = [];
        let msg = "Added Staff";
        connection.query(
          `SELECT * FROM Booking`,
          async (err, bookings, _fields) => {
            if (err) throw err;
            else {
              connection.query(
                `SELECT * FROM Ground`,
                async (err, ground, _f) => {
                  if (err) throw err;
                  else {
                    booking = bookings;
                    // console.log(ground);
                    res.render("admin", {
                      msg: { msg, flag: true },
                      booking,
                      ground,
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

router.put("/maintenance/:gid/:available", async (req, res) => {
  let { gid, available } = req.params;
  available = available == 1 ? 0 : 1;
  let query = `UPDATE Ground SET available = ${available} WHERE Gid = '${gid}'`;

  connection.query(query, async (err, results, fields) => {
    if (err) {
      console.log("Error: " + err);
      let booking = [];
      connection.query(
        `SELECT * FROM Booking`,
        async (erro, bookings, _fields) => {
          if (erro) {
            throw erro;
          } else {
            connection.query(
              `SELECT * FROM Ground`,
              async (errx, ground, _f) => {
                if (errx) throw errx;
                else {
                  booking = bookings;
                  // console.log(ground);
                  res.render("admin", {
                    msg: { msg: err, flag: false },
                    booking,
                    ground,
                  });
                }
              }
            );
          }
        }
      );
    } else {
      res.redirect("/admin");
    }
  });
});

router.delete("/booking/:id", async (req, res) => {
  connection.query(
    `DELETE FROM Booking WHERE Bid = ${req.params.id}`,
    async (err, result, fields) => {
      if (err) throw err;
      else {
        let msg = `Successfully removed Booking`;
        let booking = [];

        connection.query(
          `SELECT * FROM Booking`,
          async (err, bookings, _fields) => {
            if (err) throw err;
            else {
              connection.query(
                `SELECT * FROM Ground`,
                async (err, ground, _f) => {
                  if (err) throw err;
                  else {
                    booking = bookings;
                    // console.log(ground);
                    res.render("admin", {
                      msg: { msg, flag: true },
                      booking,
                      ground,
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

module.exports = router;
