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
        const message = 'ชื่อผู้ใช้นี้ถูกใช้งาน'
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
        accounts.gender,
        GROUP_CONCAT(subjects.subject_name ORDER BY subjects.subject_id) AS subject_names,
        GROUP_CONCAT(subjects.category ORDER BY subjects.subject_id) AS categories,
        GROUP_CONCAT(subjects.subject_place ORDER BY subjects.subject_id) AS places,
        max(subjects.price) AS max_price
      FROM tutors
      JOIN accounts ON tutors.account_id = accounts.account_id
      LEFT JOIN subjects ON tutors.tutor_id = subjects.tutor_id
      WHERE tutors.profile_status = 'พร้อมสอน'
      `
      let cond = []
      if (search.length > 0) {
        sql += ' AND tutors.account_id = ?';
        cond = [search]
      }
      sql += ` GROUP BY tutors.tutor_id 
      ORDER BY tutors.rating_score DESC, tutors.teaching_count DESC, tutors.revisit_score DESC;`;
      const [rows, fields] = await pool.query(sql, cond);
      const processedRows = rows.map(row => {
        const subjectNames = row.subject_names ? row.subject_names.split(',') : [];
        const categories = row.categories ? row.categories.split(',') : [];
        const places = row.places ? row.places.split(',') : [];
        const normalizedPlaces = places.flatMap(place => 
            place.includes(" และ ") ? place.split(" และ ") : place
          );
        return {
          ...row,
          subject_names: subjectNames,
          categories: categories,
          places: normalizedPlaces
        };
      });
  
      return res.json(processedRows);
    
    } catch (err) {
      return res.status(500).json(err)
    }
  });

  //   ดึงข้อมูลติวเตอร์จาก account_id
  router.post("/tutor/findId", async function (req, res, next) {
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
      tutor_id
    FROM tutors
    WHERE account_id = ?
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
        const [tutorResult] = await conn.query(
            'INSERT INTO tutors(account_id) VALUES (?)',
            [account.account_id]
        )
        const tutor_id = tutorResult.insertId;
        await conn.query(
            'INSERT INTO verifications(tutor_id) VALUES (?)',
            [tutor_id]
        )
        conn.commit()
        res.status(200).json({'account': account,'tutor_id': tutor_id})
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
})


//updateVerify
router.post('/tutor/verify/update', upload.fields([{ name: 'document'},{ name: 'selfie'}]), async (req, res, next) => {
    const updateSchema = Joi.object({
        tutor_id: Joi.any().required(),
    })
    try {
        await updateSchema.validateAsync({
            tutor_id: req.body.tutor_id,
        }, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    console.log(req.body.tutor_id)
    const tutor_id =req.body.tutor_id
    const documentFile = req.files['document']
    const selfieFile = req.files['selfie']
    try {
        if (!documentFile && !selfieFile ){
            conn.commit()
        }
        else{
            let updateQuery = 'UPDATE verifications SET '
            let queryParams = []

            if (documentFile && documentFile[0]) {
                const document_path = '/static/document/' + documentFile[0].filename;
                updateQuery += 'document_path = ?'
                queryParams.push(document_path)
            }
            if (selfieFile && selfieFile[0]) {
                const selfie_path = '/static/selfie/' + selfieFile[0].filename;
                if (queryParams.length > 0) {
                    updateQuery += ', selfie_path = ?'
                } else {
                    updateQuery += 'selfie_path = ?'
                }
                queryParams.push(selfie_path)
            }

            updateQuery += ' WHERE tutor_id = ?'
            queryParams.push(tutor_id)
            
            await conn.query(updateQuery, queryParams)
            conn.commit()
        }
        res.status(200).json()
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
})

//ดึงข้อมูลภาพเอกสาร
router.post("/tutor/verify/path", async function (req, res, next) {
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
        document_path,
        selfie_path
    FROM verifications
    WHERE tutor_id = ?
    `
    try {      
        const [paths] = await conn.query(sql, [tutor_id])
        const path = paths[0]
        conn.commit()
        res.status(200).json({'path': path})
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
    
  });

  //อัพเดทส่งข้อมูลรอผู้ดูแลยืนยัน
  router.post('/tutor/sentVerify', async (req, res, next) => {
    const updateSchema = Joi.object({
        tutor_id: Joi.any().required(),
    })
    try {
        await updateSchema.validateAsync({ ...req.body }, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    const tutor_id =req.body.tutor_id
    try {
        await conn.query(
            'UPDATE tutors SET profile_status=? WHERE tutor_id =?;',
            ['รอตรวจสอบ', tutor_id]
        )
        await conn.query(
            'UPDATE verifications SET status=? WHERE tutor_id =?;',
            ['รอตรวจสอบ', tutor_id]
        )
        conn.commit()
        res.status(200).json()
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
        facebook: Joi.optional(),
        line: Joi.optional(),
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

    // ดูสถานที่
router.post("/tutor/place", async function (req, res, next) {
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
    let sql = `SELECT * FROM locations WHERE tutor_id=? ORDER BY address = "ออนไลน์" ASC, timestamp ASC`
    try {

        const [places] = await conn.query(
            sql, [tutor_id]
        )
        conn.commit()
        res.status(200).json({'places': places})
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
  });



// เพิ่มสถานที่
router.post("/tutor/place/add", async function (req, res, next) {
    const Schema = Joi.object({
        tutor_id: Joi.any().required(),
        placeName: Joi.any().required(),
        address: Joi.any().required(),
        position: Joi.any().required(),
    })
    try {
        await Schema.validateAsync({ ...req.body }, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    const tutor_id = req.body.tutor_id
    const place_name = req.body.placeName
    const address = req.body.address
    const coordinates = req.body.position

    try {
        await conn.query(
            'INSERT INTO locations(tutor_id, place_name, address, coordinates) VALUES (?, ?, ?, ?)',
            [tutor_id, place_name, address, coordinates]
        )
        
        const [places] = await conn.query(
            'SELECT * FROM locations WHERE tutor_id=? ORDER BY address = "ออนไลน์" ASC, timestamp ASC', 
            [tutor_id]
        )
        conn.commit()
        res.status(200).json({'places': places})
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
  });

  // ลบสถานที่
router.post("/tutor/place/remove", async function (req, res, next) {
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    const location_id = req.body.location_id
    try {
        await conn.query(
            'DELETE FROM locations WHERE location_id = ?;',
            [location_id]
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
    const subject_name = req.body.subjectName.replace(/,/g, "");
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
      studies.*,
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
    FROM studies
    JOIN accounts ON studies.account_id = accounts.account_id
    JOIN subjects ON studies.subject_id = subjects.subject_id
    WHERE studies.tutor_id = ? AND studies.status = 'รออนุมัติ'
    ORDER BY studies.register_timestamp ASC
    `
    try {
        const [registerStudents] = await conn.query(sql, [tutor_id])
        conn.commit()
        res.status(200).json({'registerStudents': registerStudents, registerCounts: registerStudents.length})
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
        sender_id: Joi.any().required(),
    })
    try {
        await Schema.validateAsync({ ...req.body }, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    const study_id = req.body.study_id
    const sender_id = req.body.sender_id
    console.log(study_id)
    try {
        await conn.query(
            `UPDATE studies SET status = 'อนุมัติคำขอ', approve_timestamp = NOW() WHERE study_id = ?;`,
            [study_id]
        )
        const studies = await conn.query(
            `SELECT subject_id, tutor_id, account_id FROM studies WHERE study_id = ?;`, 
            [study_id]
        )
        await conn.query(
            `UPDATE subjects SET student_count = student_count + 1 WHERE subject_id = ?;`,
            [studies[0][0].subject_id]
        )
        await conn.query(
            `UPDATE tutors SET teaching_count =  (SELECT COUNT(*) FROM studies s WHERE s.tutor_id = ? AND s.status = 'อนุมัติคำขอ') WHERE tutor_id = ?;`,
            [studies[0][0].tutor_id, studies[0][0].tutor_id]
        )

        await conn.query(
            `INSERT INTO revisits (tutor_id, account_id, revisit_count)
            VALUES (?, ?, (SELECT GREATEST(COUNT(*) - 1, 0) FROM studies WHERE tutor_id = ? AND account_id = ? AND status = 'อนุมัติคำขอ'))
            ON DUPLICATE KEY UPDATE revisit_count = VALUES(revisit_count);`,
            [studies[0][0].tutor_id, studies[0][0].account_id, studies[0][0].tutor_id, studies[0][0].account_id]
        );

        await conn.query(
            `UPDATE tutors 
             SET revisit_score = (
                 SELECT (SUM(CASE WHEN revisit_count > 0 THEN 1 ELSE 0 END) * 100 / COUNT(*)) AS revisit_rate
                FROM revisits
                WHERE tutor_id = ?
             ) 
             WHERE tutor_id = ?;`,
            [studies[0][0].tutor_id, studies[0][0].tutor_id]
        );


        const [tutor] = await conn.query(`SELECT * FROM tutors WHERE tutor_id = ?`,[studies[0][0].tutor_id])
        const [subjectInfo] = await conn.query(`SELECT * FROM subjects WHERE subject_id = ?;`,[studies[0][0].subject_id])

        const tutorName = tutor[0].displayname
        const subjectName = subjectInfo[0].subject_name

        await conn.query(
            'INSERT INTO notifications (sender_id, account_id, type, message) VALUES (?, ?, ?, ?);',
            [sender_id, studies[0][0].account_id, "ตอบรับการสอน", "ผู้สอน "+tutorName+" ทำการตอบรับการสอนวิชา "+subjectName+" ของคุณ"]
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
        sender_id: Joi.any().required(),
    })
    try {
        await Schema.validateAsync({ ...req.body }, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    const study_id = req.body.study_id
    const sender_id = req.body.sender_id
    try {
        const subject = await conn.query(
            `SELECT subject_id, tutor_id, account_id FROM studies WHERE study_id = ?;`, 
            [study_id]
        )
        await conn.query(
            `UPDATE subjects SET register_count = register_count - 1 WHERE subject_id = ?;`,
            [subject[0][0].subject_id]
        )
        await conn.query(
            `UPDATE tutors SET teaching_count =  (SELECT COUNT(*) FROM studies s WHERE s.tutor_id = ? AND s.status = 'อนุมัติคำขอ') WHERE tutor_id = ?;`,
            [subject[0][0].tutor_id, subject[0][0].tutor_id]
        )

        const [tutor] = await conn.query(`SELECT * FROM tutors WHERE tutor_id = ?`,[subject[0][0].tutor_id])
        const [subjectInfo] = await conn.query(`SELECT * FROM subjects WHERE subject_id = ?;`,[subject[0][0].subject_id])

        const tutorName = tutor[0].displayname
        const subjectName = subjectInfo[0].subject_name

        await conn.query(
            'INSERT INTO notifications (sender_id, account_id, type, message) VALUES (?, ?, ?, ?);',
            [sender_id, subject[0][0].account_id, "ปฏิเสธการสอน", "ผู้สอน "+tutorName+" ทำการปฏิเสธการสมัครเรียนวิชา "+subjectName+" ของคุณ"]
            )

        await conn.query(
            `DELETE FROM studies WHERE study_id = ?`,
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
      studies.*,
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
    FROM studies
    JOIN accounts ON studies.account_id = accounts.account_id
    JOIN subjects ON studies.subject_id = subjects.subject_id
    WHERE studies.tutor_id = ? AND studies.status = 'อนุมัติคำขอ'
    ORDER BY studies.approve_timestamp DESC
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
    let sql = `SELECT comments.*, accounts.portrait_path, accounts.account_id, accounts.firstname, accounts.lastname
            FROM comments
            JOIN accounts ON comments.account_id = accounts.account_id
            WHERE comments.tutor_id=? ORDER BY comments.timestamp DESC`
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
                'SELECT announces.*, accounts.firstname, accounts.lastname FROM announces JOIN accounts ON announces.account_id = accounts.account_id ORDER BY announces.announce_id DESC', 
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

    //   ดึงข้อมูลนักเรียนที่ต้องการดูข้อมูล
    router.post("/tutor/student/info", async function (req, res, next) {
        const Schema = Joi.object({
            student_id: Joi.any().required(),
        })
        try {
            await Schema.validateAsync({ ...req.body }, { abortEarly: false })
        } catch (err) {
            return res.status(400).send(err)
        }
        const conn = await pool.getConnection()
        await conn.beginTransaction()
        const student_id =req.body.student_id
        let sql = `
        SELECT
        accounts.portrait_path,
        accounts.username,
        accounts.permission,
        accounts.firstname,
        accounts.lastname,
        accounts.gender,
        accounts.email,
        accounts.phone
        FROM accounts
        WHERE account_id = ?
        `
        try {      
            const [students] = await conn.query(sql, [student_id])
            const student = students[0]
            conn.commit()
            res.status(200).json({'student': student})
        } catch (err) {
            conn.rollback()
            res.status(400).json(err.toString());
        } finally {
            conn.release()
        }
        
    });

exports.router = router;
