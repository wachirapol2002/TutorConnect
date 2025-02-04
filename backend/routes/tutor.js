const express = require("express");
const pool = require("../DBconfig");
const Joi = require('joi')
const bcrypt = require('bcrypt')
const upload = require("../multer");
const fs = require('fs');
const path = require('path');

router = express.Router();

const passwordValidator = (value) => {
    if (value.length < 8) {
        throw new Joi.ValidationError('Password must contain at least 8 characters')
    }
    if (!(value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/))) {
        throw new Joi.ValidationError('Password must be harder')
    }
    return value
}

const usernameValidator = async (value) => {
    const [rows, _] = await pool.query(
        "SELECT username FROM accounts WHERE username = ?",
        [value]
    )
    if (rows.length > 0) {
        const message = ''
        throw new Joi.ValidationError(message, { message })
    }
    return value
}


router.get("/tutor/teacher/info", async function (req, res, next) {
    try {
      const search = req.query.search || ''
      let sql = `
      SELECT
        tutors.*,
        accounts.portrait_path,
        GROUP_CONCAT(DISTINCT subjects.subject_name ORDER BY subjects.subject_id) AS subject_names,
        GROUP_CONCAT(DISTINCT subjects.category ORDER BY subjects.subject_id) AS categories
      FROM tutors
      JOIN accounts ON tutors.account_id = accounts.account_id
      LEFT JOIN subjects ON tutors.tutor_id = subjects.tutor_id
      `
      let cond = []
      if (search.length > 0) {
        sql += ' WHERE tutors.account_id = ?';
        cond = [search]
      }
      sql += ' GROUP BY tutors.tutor_id';
      const [rows, fields] = await pool.query(sql, cond);
      const processedRows = rows.map(row => {
        const subjectNames = row.subject_names ? row.subject_names.split(',') : [];
        const categories = row.categories ? row.categories.split(',') : [];
        return {
          ...row,
          subject_names: subjectNames,
          categories: categories
        };
      });
  
      return res.json(processedRows);
    
    } catch (err) {
      return res.status(500).json(err)
    }
  });

//   ดึงข้อมูลติวเตอร์จาก account_id
  router.post("/tutor/teacher/info/byAccount", async function (req, res, next) {
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
    const account_id =req.body.account_id
    let sql = `
    SELECT
      tutors.*,
      accounts.portrait_path,
      accounts.phone
    FROM tutors
    JOIN accounts ON tutors.account_id = accounts.account_id
    WHERE tutors.account_id = ?
    `
    try {      
        const [tutors] = await conn.query(sql, [account_id])
        const tutor = tutors[0]
        conn.commit()
        res.status(200).json({'tutor': tutor})
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
    
  });

//   ดึงข้อมูลติวเตอร์จาก tutor_id
  router.post("/tutor/teacher/info", async function (req, res, next) {
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
    const tutor_id =req.body.tutor_id
    let sql = `
    SELECT
      tutors.*,
      accounts.portrait_path,
      accounts.phone
    FROM tutors
    JOIN accounts ON tutors.account_id = accounts.account_id
    WHERE tutors.tutor_id = ?
    `
    try {      
        const [tutors] = await conn.query(sql, [tutor_id])
        const tutor = tutors[0]
        conn.commit()
        res.status(200).json({'tutor': tutor})
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
    
  });

//TutorRegister
router.post('/tutor/register', upload.single('portrait'), async (req, res, next) => {
    const registerSchema = Joi.object({
        username: Joi.string().required().min(5).max(20).external(usernameValidator),
        password: Joi.string().required().custom(passwordValidator),
        confirmPassword: Joi.ref('password'),
        firstname: Joi.string().max(100).required(),
        lastname: Joi.string().max(100).required(),
        gender: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required().pattern(/0[0-9]{9}/),
        portrait: Joi.any().required()
    })
    try {
        await registerSchema.validateAsync({ ...req.body, portrait: req.file }, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    const file = req.file;
    const username = req.body.username
    const password = await bcrypt.hash(req.body.password, 5)
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const gender = req.body.gender
    const email = req.body.email
    const phone = req.body.phone
    try {
        const portrait_path = '/static/portraits/' + file.filename;
        await conn.query(
            'INSERT INTO accounts(portrait_path, username, password, permission, firstname, lastname, gender, email, phone) VALUES (?, ?, ?, "ติวเตอร์", ?, ?, ?, ?,?)',
            [portrait_path, username, password, firstname, lastname, gender, email, phone]
        )
        const [accounts] = await conn.query(
            'SELECT * FROM accounts WHERE username=?', 
            [username]
        )
        const account = accounts[0]
        await conn.query(
            'INSERT INTO tutors(account_id) VALUES (?)',
            [account.account_id]
        )
        conn.commit()
        res.status(200).json({'account': account})
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
})


//updateTeacherInfo
router.post('/tutor/teacher/update', async (req, res, next) => {
    const updateSchema = Joi.object({
        account_id: Joi.any().required(),
        tutorName: Joi.string().required().min(2).max(30),
        facebook: Joi.string().optional(),
        line: Joi.string().optional(),
        introduce: Joi.string().required(),
        describe: Joi.string().required(),
    })
    try {
        await updateSchema.validateAsync({ ...req.body }, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    const account_id =req.body.account_id
    const tutorName = req.body.tutorName
    const facebook = req.body.facebook
    const line = req.body.line
    const introduce = req.body.introduce
    const describe = req.body.describe
    console.log(req.body.describe)
    try {
        await conn.query(
            'UPDATE tutors SET displayname=?, facebook_link=?, line_id=?, introduce_message=?, description=? WHERE account_id=?;',
            [tutorName, facebook, line, introduce, describe, account_id]
        )
        
        const [tutors] = await conn.query(
            'SELECT * FROM tutors WHERE account_id=?', 
            [account_id]
        )
        const tutor = tutors[0]
        conn.commit()
        res.status(200).json({'tutor': tutor})
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
})

// ดูประวัติการศึกษา
router.post("/tutor/graduate", async function (req, res, next) {
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
        const [graduates] = await conn.query(
            'SELECT * FROM graduates WHERE tutor_id=?', 
            [tutor_id]
        )
        conn.commit()
        res.status(200).json({'graduates': graduates})
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
  });

// เพิ่มประวัติการศึกษา
router.post("/tutor/graduate/add", async function (req, res, next) {
    const Schema = Joi.object({
        tutor_id: Joi.any().required(),
        status: Joi.optional(),
        degree: Joi.optional(),
        school_name: Joi.string().required(),
        honor: Joi.optional(),
        grade: Joi.optional(),
    })
    try {
        await Schema.validateAsync({ ...req.body }, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    const tutor_id = req.body.tutor_id
    const status = req.body.status
    const degree = req.body.degree
    const school_name = req.body.school_name
    const honor = req.body.honor
    const grade = req.body.grade
    try {
        await conn.query(
            'INSERT INTO graduates(tutor_id, status, degree, school_name, honor, grade) VALUES (?, ?, ?, ?, ?, ?)',
            [tutor_id, status, degree, school_name, honor, grade]
        )
        
        const [graduates] = await conn.query(
            'SELECT * FROM graduates WHERE tutor_id=?', 
            [tutor_id]
        )
        conn.commit()
        res.status(200).json({'graduates': graduates})
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
  });

  // ลบประวัติการศึกษา
router.post("/tutor/graduate/remove", async function (req, res, next) {
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    const graduate_id = req.body.graduate_id
    try {
        await conn.query(
            'DELETE FROM graduates WHERE graduate_id = ?;',
            [graduate_id]
        )  
        conn.commit()
        res.status(201).send()
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
  });



// ดูวิชาที่่สอน
router.post("/tutor/subject", async function (req, res, next) {
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
    let sql = `SELECT subjects.*, tutors.displayname
            FROM subjects
            JOIN tutors ON subjects.tutor_id = tutors.tutor_id
            WHERE subjects.tutor_id=?`
    try {

        const [subjects] = await conn.query(
            sql, [tutor_id]
        )
        conn.commit()
        res.status(200).json({'subjects': subjects})
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
  });



// เพิ่มวิชา
router.post("/tutor/subject/add", async function (req, res, next) {
    const Schema = Joi.object({
        tutor_id: Joi.any().required(),
        selectedCategory: Joi.any().required(),
        subjectName: Joi.string().required(),
        subjectDegree: Joi.optional(),
        subjectPrice: Joi.optional(),
        subjectDescribe: Joi.any().optional(),
        subjectPlace: Joi.any().required(),
    })
    try {
        await Schema.validateAsync({ ...req.body }, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    console.log(req.body.subjectDegree)
    const tutor_id = req.body.tutor_id
    const category = req.body.selectedCategory
    const subject_name = req.body.subjectName
    const description = req.body.subjectDescribe
    const degree_level = req.body.subjectDegree
    const price = req.body.subjectPrice
    const subject_place = req.body.subjectPlace

    try {
        await conn.query(
            'INSERT INTO subjects(tutor_id, category, subject_name, description, subject_place, degree_level, price) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [tutor_id, category, subject_name, description, subject_place, degree_level, price]
        )
        
        const [subjects] = await conn.query(
            'SELECT * FROM subjects WHERE tutor_id=?', 
            [tutor_id]
        )
        conn.commit()
        res.status(200).json({'subjects': subjects})
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
  });

// ลบวิชา
router.post("/tutor/subject/remove", async function (req, res, next) {
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    const subject_id = req.body.subject_id
    try {
        await conn.query(
            'DELETE FROM subjects WHERE subject_id = ?;',
            [subject_id]
        )  
        conn.commit()
        res.status(201).send()
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
  });


  // ดูนักเรียนที่สมัครเรียน
router.post("/tutor/student/register", async function (req, res, next) {
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
    let sql = `
    SELECT
      studys.*,
      accounts.portrait_path,
      accounts.username,
      accounts.permission,
      accounts.email,
      accounts.firstname,
      accounts.lastname,
      accounts.gender,
      accounts.phone,
      subjects.subject_name,
      subjects.degree_level,
      subjects.subject_place,
      subjects.price
    FROM studys
    JOIN accounts ON studys.account_id = accounts.account_id
    JOIN subjects ON studys.subject_id = subjects.subject_id
    WHERE studys.tutor_id = ? AND studys.status = 'รออนุมัติ'
    ORDER BY studys.register_timestamp ASC
    `
    try {
        const [registerStudents] = await conn.query(sql, [tutor_id])
        conn.commit()
        res.status(200).json({'registerStudents': registerStudents})
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
  });


// ยอมรับการสมัครเรียน
router.post("/tutor/enroll/accept", async function (req, res, next) {
    const Schema = Joi.object({
        study_id: Joi.any().required(),
    })
    try {
        await Schema.validateAsync({ ...req.body }, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    const study_id = req.body.study_id
    console.log(study_id)
    try {
        await conn.query(
            `UPDATE studys SET status = 'อนุมัติคำขอ', approve_timestamp = NOW()  WHERE study_id = ?;`,
            [study_id]
        )
        const subject_id = await conn.query(
            `SELECT subject_id FROM studys WHERE study_id = ?;`, 
            [study_id]
        )
        await conn.query(
            `UPDATE subjects SET student_count = student_count + 1 WHERE subject_id = ?;`,
            [subject_id[0][0].subject_id]
        )
        conn.commit()
        res.status(200).json({ message: "ยอมรับคำขอแล้ว" });
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
  });


  // ปฏิเสธคำขอสมัครเรียน
router.post("/tutor/enroll/unaccept", async function (req, res, next) {
    const Schema = Joi.object({
        study_id: Joi.any().required(),
    })
    try {
        await Schema.validateAsync({ ...req.body }, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    const study_id = req.body.study_id
    console.log(study_id)
    try {
        const subject_id = await conn.query(
            `SELECT subject_id FROM studys WHERE study_id = ?;`, 
            [study_id]
        )
        await conn.query(
            `UPDATE subjects SET register_count = register_count - 1 WHERE subject_id = ?;`,
            [subject_id[0][0].subject_id]
        )
        await conn.query(
            `DELETE FROM studys WHERE study_id = ?`,
            [study_id]
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

    // ดูนักเรียนของติวเตอร์
    router.post("/tutor/studentlist", async function (req, res, next) {
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
    let sql = `
    SELECT
      studys.*,
      accounts.portrait_path,
      accounts.username,
      accounts.permission,
      accounts.email,
      accounts.firstname,
      accounts.lastname,
      accounts.gender,
      accounts.phone,
      subjects.subject_name,
      subjects.degree_level,
      subjects.subject_place,
      subjects.price
    FROM studys
    JOIN accounts ON studys.account_id = accounts.account_id
    JOIN subjects ON studys.subject_id = subjects.subject_id
    WHERE studys.tutor_id = ? AND studys.status = 'อนุมัติคำขอ'
    ORDER BY studys.approve_timestamp DESC
    `
    try {
        const [students] = await conn.query(sql, [tutor_id])
        conn.commit()
        res.status(200).json({'students': students})
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
  });



  // ดูcommentsทั้งหมด
    router.post("/tutor/comment", async function (req, res, next) {
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
    let sql = `SELECT comments.*, accounts.portrait_path, accounts.firstname, accounts.lastname
            FROM comments
            JOIN accounts ON comments.account_id = accounts.account_id
            WHERE comments.tutor_id=?`
    try {

        const [comments] = await conn.query(
            sql, [tutor_id]
        )
        conn.commit()
        res.status(200).json({'comments': comments})
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
  });

    // หางานสอน
    router.post("/tutor/announce", async function (req, res, next) {
        const conn = await pool.getConnection()
        await conn.beginTransaction()
        try {
            const [announces] = await conn.query(
                'SELECT announces.*, accounts.firstname, accounts.lastname FROM announces JOIN accounts ON announces.account_id = accounts.account_id ORDER BY announces.announce_id ASC', 
                []
            )
            conn.commit()
            res.status(200).json({'announces': announces})
        } catch (err) {
            conn.rollback()
            res.status(400).json(err.toString());
        } finally {
            conn.release()
        }
      });

exports.router = router;
