const express = require("express");
const pool = require("../DBconfig");

router = express.Router();

router.get("/", async function (req, res, next) {
  try {
    const search = req.query.search || ''
    let sql = 'SELECT * FROM accounts'
    let cond = []

    if (search.length > 0) {
      sql = 'SELECT * FROM accounts WHERE username = ? OR account_id =?;'
      cond = [search, search]
    }
    const [rows, fields] = await pool.query(sql, cond);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json(err)
  }
});


exports.router = router;
