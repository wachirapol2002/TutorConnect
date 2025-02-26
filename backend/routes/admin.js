const express = require("express");
const pool = require("../DBconfig");
const Joi = require('joi')
const bcrypt = require('bcrypt')
const upload = require("../multer");
const fs = require('fs');
const path = require('path');

router = express.Router();

//   ดึงข้อมูลติวเตอร์รอยินยัน
router.post("/tutorlist/unverify", async function (req, res, next) {
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    let sql = `
    SELECT
      tutors.*,
      accounts.username,
      accounts.firstname,
      accounts.lastname,
      accounts.email,
      accounts.gender,
      accounts.portrait_path,
      accounts.phone,
      verifications.document_path,
      verifications.selfie_path,
      verifications.status_timestamp
    FROM tutors
    JOIN accounts ON tutors.account_id = accounts.account_id
    JOIN verifications ON tutors.tutor_id = verifications.tutor_id
    WHERE tutors.profile_status = 'รอตรวจสอบ'
    ORDER BY tutors.date_modified 
    `
    try {      
        const [tutors] = await conn.query(sql)
        conn.commit()
        res.status(200).json({'tutors': tutors})
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
    
  });



  // อนุมัติติวเตอร์
router.post("/admin/verify/accept", async function (req, res, next) {
    const Schema = Joi.object({
        tutor_id: Joi.any().required(),
    })
    try {
        await Schema.validateAsync({ ...req.body }, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    const tutor_id = req.body.tutor_id
    try {
        await conn.query(
            `UPDATE tutors SET profile_status = 'พร้อมสอน' WHERE tutor_id = ?;`,
            [tutor_id]
        )
        await conn.query(
            `UPDATE verifications SET status = 'พร้อมสอน' WHERE tutor_id = ?;`,
            [tutor_id]
        )
        conn.commit()
        res.status(200).json({ message: "อนุมัติคำขอแล้ว" });
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
  });


  // ปฏิเสธติวเตอร์
router.post("/admin/verify/unaccept", async function (req, res, next) {
    const Schema = Joi.object({
        tutor_id: Joi.any().required(),
    })
    try {
        await Schema.validateAsync({ ...req.body }, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    const tutor_id = req.body.tutor_id
    console.log(tutor_id)
    try {
        await conn.query(
            `UPDATE tutors SET profile_status = 'สมัครติวเตอร์' WHERE tutor_id = ?;`,
            [tutor_id]
        )
        await conn.query(
            `UPDATE verifications SET status = 'สมัครติวเตอร์' WHERE tutor_id = ?;`,
            [tutor_id]
        )
        conn.commit()
        res.status(200).json({ message: "ปฏิเสธคำขอแล้ว" });
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
  });


  exports.router = router;