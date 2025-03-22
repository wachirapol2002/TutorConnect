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

//   ดึงข้อมูลติวเตอร์รอยินยัน
router.post("/tutor/personal", async function (req, res, next) {
    const Schema = Joi.object({
        account_id: Joi.any().required(),
    })
    try {
        await Schema.validateAsync({ ...req.body }, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const account_id = req.body.account_id
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
    WHERE tutors.account_id = ?
    `
    try {      
        const [tutor] = await conn.query(sql, account_id)
        conn.commit()
        res.status(200).json({'tutor': tutor[0]})
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
    
  });


//   ดึงข้อมูลติวเตอร์ทั้งหมด
router.post("/tutorlist/info", async function (req, res, next) {
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    let sql = `
    SELECT
      tutors.*,
      accounts.account_id,
      accounts.portrait_path,
      accounts.username,
      accounts.firstname,
      accounts.lastname,
      accounts.email,
      accounts.phone,
      accounts.report_count,
      verifications.document_path,
      verifications.selfie_path,
      verifications.status_timestamp
    FROM tutors
    JOIN accounts ON tutors.account_id = accounts.account_id
    JOIN verifications ON tutors.tutor_id = verifications.tutor_id
    WHERE tutors.profile_status != 'สมัครติวเตอร์' and accounts.permission = "ติวเตอร์"
    ORDER BY accounts.account_id
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




//   นับติวเตอร์ที่รอยืนยัน
  router.post("/tutorlist/unverify/count", async function (req, res, next) {
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    let sql = `
    SELECT
      COUNT(*) AS count
    FROM tutors
    JOIN accounts ON tutors.account_id = accounts.account_id
    JOIN verifications ON tutors.tutor_id = verifications.tutor_id
    WHERE tutors.profile_status = 'รอตรวจสอบ'
    `
    try {      
        const [unverify] = await conn.query(sql)
        conn.commit()
        res.status(200).json({'count': unverify[0].count})
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
        sender_id: Joi.any().required(),
    })
    try {
        await Schema.validateAsync({ ...req.body }, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    const tutor_id = req.body.tutor_id
    const sender_id = req.body.sender_id
    try {
        await conn.query(
            `UPDATE tutors SET profile_status = 'พร้อมสอน' WHERE tutor_id = ?;`,
            [tutor_id]
        )
        await conn.query(
            `UPDATE verifications SET status = 'พร้อมสอน' WHERE tutor_id = ?;`,
            [tutor_id]
        )

        const [accounts] = await conn.query(`SELECT tutors.account_id FROM tutors WHERE tutors.tutor_id = ?;`,[tutor_id])

        const account_id = accounts[0].account_id

        await conn.query(
            'INSERT INTO notifications (sender_id, account_id, type, message) VALUES (?, ?, ?, ?);',
            [sender_id, account_id, "ได้รับสิทธิ์เป็นผู้สอน", "ผู้ดูแลระบบตรวจสอบข้อมูลยืนยันตัวตนของคุณแล้ว"]
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
        sender_id: Joi.any().required(),
        message: Joi.required(),
    })
    try {
        await Schema.validateAsync({ ...req.body }, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    const tutor_id = req.body.tutor_id
    const sender_id = req.body.sender_id
    const message = req.body.message
    console.log(message)
    try {
        await conn.query(
            `UPDATE tutors SET profile_status = 'สมัครติวเตอร์' WHERE tutor_id = ?;`,
            [tutor_id]
        )
        await conn.query(
            `UPDATE verifications SET status = 'สมัครติวเตอร์' WHERE tutor_id = ?;`,
            [tutor_id]
        )
        const [accounts] = await conn.query(`SELECT tutors.account_id FROM tutors WHERE tutors.tutor_id = ?;`,[tutor_id])

        const account_id = accounts[0].account_id

        await conn.query(
            'INSERT INTO notifications (sender_id, account_id, type, message) VALUES (?, ?, ?, ?);',
            [sender_id, account_id, "ถูกปฏิเสธสิทธิ์เป็นผู้สอน", message]
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

    // ระงับติวเตอร์
    router.post("/admin/tutor/ban", async function (req, res, next) {
        const Schema = Joi.object({
            tutor_id: Joi.any().required(),
            sender_id: Joi.any().required(),
            message: Joi.required(),
        })
        try {
            await Schema.validateAsync({ ...req.body }, { abortEarly: false })
        } catch (err) {
            return res.status(400).send(err)
        }
        const conn = await pool.getConnection()
        await conn.beginTransaction()
        const tutor_id = req.body.tutor_id
        const sender_id = req.body.sender_id
        const message = req.body.message
        try {
            await conn.query(
                `UPDATE tutors SET profile_status = 'ระงับชั่วคราว' WHERE tutor_id = ?;`,
                [tutor_id]
            )
            await conn.query(
                `UPDATE verifications SET status = 'ระงับชั่วคราว' WHERE tutor_id = ?;`,
                [tutor_id]
            )

            const [accounts] = await conn.query(`SELECT tutors.account_id FROM tutors WHERE tutors.tutor_id = ?;`,[tutor_id])

            const account_id = accounts[0].account_id

            await conn.query(
                'INSERT INTO notifications (sender_id, account_id, type, message) VALUES (?, ?, ?, ?);',
                [sender_id, account_id, "ระงับการสอน", 'ผู้ดูแลระงับการสอนของคุณชั่วคราว โปรดติดต่อผู้ดูแล '+'"'+message+'"']
            )
            conn.commit()

            res.status(200).json({ message: "ระงับการสอนแล้ว" });
        } catch (err) {
            conn.rollback()
            res.status(400).json(err.toString());
        } finally {
            conn.release()
        }
    });

     // ปลดระงับติวเตอร์
     router.post("/admin/tutor/unban", async function (req, res, next) {
        const Schema = Joi.object({
            tutor_id: Joi.any().required(),
            sender_id: Joi.any().required(),
        })
        try {
            await Schema.validateAsync({ ...req.body }, { abortEarly: false })
        } catch (err) {
            return res.status(400).send(err)
        }
        const conn = await pool.getConnection()
        await conn.beginTransaction()
        const tutor_id = req.body.tutor_id
        const sender_id = req.body.sender_id
        try {
            await conn.query(
                `UPDATE tutors SET profile_status = 'พร้อมสอน' WHERE tutor_id = ?;`,
                [tutor_id]
            )
            await conn.query(
                `UPDATE verifications SET status = 'พร้อมสอน' WHERE tutor_id = ?;`,
                [tutor_id]
            )

            const [accounts] = await conn.query(`SELECT tutors.account_id FROM tutors WHERE tutors.tutor_id = ?;`,[tutor_id])

            const account_id = accounts[0].account_id

            await conn.query(
                'INSERT INTO notifications (sender_id, account_id, type, message) VALUES (?, ?, ?, ?);',
                [sender_id, account_id, "ปลดระงับการสอน", "ผู้ดูแลได้ให้สิทธิ์อนุญาติการสอนคุณอีกครั้ง"]
            )
            conn.commit()

            res.status(200).json({ message: "ปลดการระงับแล้ว" });
        } catch (err) {
            conn.rollback()
            res.status(400).json(err.toString());
        } finally {
            conn.release()
        }
    });

  //   ดึงข้อมูลนักเรียนทั้งหมด
router.post("/studentlist/info", async function (req, res, next) {
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    let sql = `
    SELECT 
        account_id,
        portrait_path,
        username,
        firstname,
        lastname,
        gender,
        email,
        phone,
        report_count
    FROM accounts
    WHERE permission = "นักเรียน"
    ORDER BY account_id;
    `
    try {      
        const [students] = await conn.query(sql)
        conn.commit()
        res.status(200).json({'students': students})
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
    
  });

  //ดึงรายงาน
router.post('/reportlist', async (req, res, next) => {
    const Schema = Joi.object({
        account_id: Joi.any().required(),
    })
    try {
        await Schema.validateAsync({ ...req.body }, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
  
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    const account_id = req.body.account_id

    console.log(account_id)

    try {
        let sql = `
        SELECT 
            r.report_id,
            r.message,
            r.timestamp,
            a1.username AS reported_username,
            a2.username AS reporter_username
        FROM reports r
        JOIN accounts a1 ON r.account_id = a1.account_id
        JOIN accounts a2 ON r.reporter_id = a2.account_id
        WHERE r.account_id = ?
        ORDER BY r.timestamp DESC;
        `
        await conn.query(sql,[account_id])

        // Check if username is correct
        const [reports] = await conn.query(sql,[account_id])

        conn.commit()
        res.status(200).json({'reports': reports})
    } catch (error) {
        conn.rollback()
        res.status(403).json({ message: error.message })
    } finally {
        conn.release()
    }
})







  exports.router = router;