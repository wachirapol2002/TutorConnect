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
      let sql = 'SELECT * FROM tutors'
      let cond = []
  
      if (search.length > 0) {
        sql = 'SELECT * FROM tutors WHERE account_id = ?;'
        cond = [search]
      }
      const [rows, fields] = await pool.query(sql, cond);
      return res.json(rows);
    } catch (err) {
      return res.status(500).json(err)
    }
  });

  router.post("/tutor/teacher/info", async function (req, res, next) {
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
    try {      
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
    try {
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



// เพิ่มวิชา
router.post("/tutor/subject/add", async function (req, res, next) {
    const Schema = Joi.object({
        tutor_id: Joi.any().required(),
        selectedCategory: Joi.any().required(),
        subjectName: Joi.string().required(),
        subjectDegree: Joi.optional(),
        subjectPrice: Joi.optional(),
    })
    try {
        await Schema.validateAsync({ ...req.body }, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    const tutor_id = req.body.tutor_id
    const category = req.body.selectedCategory
    const subject_name = req.body.subjectName
    const degree_level = req.body.subjectDegree
    const price = req.body.subjectPrice
    try {
        await conn.query(
            'INSERT INTO subjects(tutor_id, category, subject_name, degree_level, price) VALUES (?, ?, ?, ?, ?)',
            [tutor_id, category, subject_name, degree_level, price]
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

exports.router = router;
