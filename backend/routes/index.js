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

router.get("/category/subject", async function (req, res, next) {
  try {
    const category = req.query.category || ''
    let sql = `
    SELECT subject_name, SUM(student_count) AS total_students
    FROM subjects
    JOIN tutors ON subjects.tutor_id = tutors.tutor_id
    WHERE tutors.profile_status = "พร้อมสอน"
    `
    let cond = []
    if (category.length > 0) {
      sql += ' and category = ?';
      cond = [category]
    }
    sql += 'GROUP BY subject_name ORDER BY total_students DESC'
    const [rows, fields] = await pool.query(sql, cond);
    return res.json(rows.map(subject => subject.subject_name));
  } catch (err) {
    return res.status(500).json(err)
  }
});


exports.router = router;
