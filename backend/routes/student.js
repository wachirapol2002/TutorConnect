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

//StudentRegister
router.post('/student/register', async (req, res, next) => {
    const registerSchema = Joi.object({
        username: Joi.string().required().min(5).max(20).external(usernameValidator),
        password: Joi.string().required().custom(passwordValidator),
        confirmPassword: Joi.ref('password'),
        firstname: Joi.string().max(100).required(),
        lastname: Joi.string().max(100).required(),
        gender: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required().pattern(/0[0-9]{9}/),
    })
    try {
        await registerSchema.validateAsync(req.body, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    const username = req.body.username
    const password = await bcrypt.hash(req.body.password, 5)
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const gender = req.body.gender
    const email = req.body.email
    const phone = req.body.phone
    try {
        await conn.query(
            'INSERT INTO accounts(username, password, permission, firstname, lastname, gender, email, phone) VALUES (?, ?, "นักเรียน", ?, ?, ?, ?,?)',
            [username, password, firstname, lastname, gender, email, phone]
        )
        conn.commit()
        res.status(201).send()
    } catch (err) {
        conn.rollback()
        res.status(404).json(err.toString());
    } finally {
        conn.release()
    }
})


//สมัครเรียน
router.post('/student/subject/register', async (req, res, next) => {
    const Schema = Joi.object({
        account_id: Joi.required(),
        tutor_id: Joi.required(),
        subject_id: Joi.required()
    })
    try {
        await Schema.validateAsync(req.body, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    const account_id = req.body.account_id
    const tutor_id = req.body.tutor_id
    const subject_id = req.body.subject_id
    try {
        const [rows] = await conn.query(
            `SELECT * FROM studies WHERE account_id = ? AND tutor_id = ? AND subject_id = ?`,
            [account_id, tutor_id, subject_id]
        );
        if (rows.length > 0) {
            // หากพบข้อมูลซ้ำ
            throw new Error('คุณส่งคำขอสมัครเรียนแล้ว');
        } else {
            // หากไม่มีข้อมูลซ้ำ ให้ทำการ INSERT
            await conn.query(
                `INSERT INTO studies(account_id, tutor_id, subject_id, status) VALUES (?, ?, ?, 'รออนุมัติ')`,
                [account_id, tutor_id, subject_id]
            );
            await conn.query(
                `UPDATE subjects SET register_count = register_count + 1 WHERE subject_id = ?`,
                [subject_id]
            );

            const [student] = await conn.query(`SELECT username, account_id FROM accounts WHERE account_id = ?;`,[account_id])
            const [subject] = await conn.query(`SELECT * FROM subjects WHERE subject_id = ?;`,[subject_id])

            const username = student[0].username
            const subjectName = subject[0].subject_name

            const [tutors] = await conn.query(`SELECT tutors.account_id FROM tutors WHERE tutors.tutor_id = ?;`,[tutor_id])

            const tutor_ac_id = tutors[0].account_id

            await conn.query(
                'INSERT INTO notifications (sender_id, account_id, type, message) VALUES (?, ?, ?, ?);',
                [student[0].account_id, tutor_ac_id, "สมัครเรียน", "ผู้ใช้งาน "+username+" สมัครเรียนวิชา "+subjectName+" ของคุณ"]
            )
        }
        conn.commit()
        res.status(201).send()
    } catch (err) {
        conn.rollback()
        res.status(400).json({ message: err.message });
    } finally {
        conn.release()
    }
})

//ยกเลิกการสมัครเรียน
router.post('/student/subject/cancelRegister', async (req, res, next) => {
    const Schema = Joi.object({
        study_id: Joi.required(),
        account_id: Joi.required(),
        tutor_id: Joi.required(),
        subject_id: Joi.required()
    })
    try {
        await Schema.validateAsync(req.body, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    const study_id = req.body.study_id
    const account_id = req.body.account_id
    const tutor_id = req.body.tutor_id
    const subject_id = req.body.subject_id
    try {
        const [rows] = await conn.query(
            `SELECT * FROM studies WHERE study_id = ?`,
            [study_id]
        );
        if (rows.length > 0) {
            // หากมีข้อมูล
            await conn.query(
                'DELETE FROM studies WHERE study_id = ?;',
                [study_id]
            );
            await conn.query(
                `UPDATE subjects SET register_count = register_count - 1 WHERE subject_id = ?`,
                [subject_id]
            );
            
            const [student] = await conn.query(`SELECT username, account_id FROM accounts WHERE account_id = ?;`,[account_id])
            const [subject] = await conn.query(`SELECT * FROM subjects WHERE subject_id = ?;`,[subject_id])

            const username = student[0].username
            const subjectName = subject[0].subject_name

            const [tutors] = await conn.query(`SELECT tutors.account_id FROM tutors WHERE tutors.tutor_id = ?;`,[tutor_id])

            const tutor_ac_id = tutors[0].account_id

            await conn.query(
                'INSERT INTO notifications (sender_id, account_id, type, message) VALUES (?, ?, ?, ?);',
                [student[0].account_id, tutor_ac_id, "ยกเลิกการสมัครเรียน", "ผู้ใช้งาน "+username+" ทำการยกเลิกการสมัครเรียนวิชา "+subjectName+" ของคุณ"]
            )
            
        } else {
            // หากไม่มีข้อมูล
            throw new Error('คุณยกเลิกการสมัครแล้ว');
        }
        conn.commit()
        res.status(201).send()
    } catch (err) {
        conn.rollback()
        res.status(400).json({ message: err.message });
    } finally {
        conn.release()
    }
})

    // ดูติวเตอร์ที่เคยเรียนด้วย
    router.post("/student/tutorlist", async function (req, res, next) {
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

        let sql = `
        SELECT
          studies.*,
          tutors.*,
          subjects.*,
          accounts.portrait_path,
          accounts.phone,
        GROUP_CONCAT(DISTINCT subjects.subject_name ORDER BY subjects.subject_id SEPARATOR ', ') AS subject_list,
        GROUP_CONCAT(DISTINCT subjects.category ORDER BY subjects.subject_id SEPARATOR ', ') AS category_list,
        MIN(studies.approve_timestamp) AS first_approve_timestamp
        FROM studies
        JOIN tutors ON studies.tutor_id = tutors.tutor_id
        JOIN subjects ON studies.subject_id = subjects.subject_id
        JOIN accounts ON tutors.account_id = accounts.account_id
        WHERE studies.account_id = ? AND studies.status = 'อนุมัติคำขอ'
        GROUP BY tutors.tutor_id
        ORDER BY first_approve_timestamp DESC;
        `
        try {
            const [tutors] = await conn.query(sql, [account_id])
            conn.commit()
            res.status(200).json({'tutors': tutors})
        } catch (err) {
            conn.rollback()
            res.status(400).json(err.toString());
        } finally {
            conn.release()
        }
      });

      // ดูวิชาที่่ต้องการสมัครหรือเรียน
    router.post("/student/subject", async function (req, res, next) {
        const Schema = Joi.object({
            tutor_id: Joi.any().required(),
            account_id: Joi.any().required(),
        })
        try {
            await Schema.validateAsync({ ...req.body }, { abortEarly: false })
        } catch (err) {
            return res.status(400).send(err)
        }
        const conn = await pool.getConnection()
        await conn.beginTransaction()
        const tutor_id = req.body.tutor_id
        const account_id = req.body.account_id
        let sql = `
                SELECT subjects.*, tutors.displayname, studies.study_id, studies.status, studies.rating_study, studies.register_timestamp, studies.approve_timestamp
                FROM subjects
                JOIN tutors ON subjects.tutor_id = tutors.tutor_id
                LEFT JOIN studies ON subjects.subject_id = studies.subject_id AND studies.account_id = ?
                WHERE subjects.tutor_id = ?
                ORDER BY subjects.timestamp ASC
                `
        try {

            const [subjects] = await conn.query(
                sql, [account_id, tutor_id]
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


    // เช็คว่าเคยเรียน
    router.post("/student/checkStudy", async function (req, res, next) {
        const Schema = Joi.object({
            tutor_id: Joi.any().required(),
            account_id: Joi.any().required(),
        })
        try {
            await Schema.validateAsync({ ...req.body }, { abortEarly: false })
        } catch (err) {
            return res.status(400).send(err)
        }
        const conn = await pool.getConnection()
        await conn.beginTransaction()
        const tutor_id = req.body.tutor_id
        const account_id = req.body.account_id
        let sql = `
        SELECT * FROM studies WHERE tutor_id = ? AND account_id= ? AND status = 'อนุมัติคำขอ'
        `
        try {
            const [study] = await conn.query(sql, [tutor_id, account_id])
            await conn.commit();
            if (study.length > 0) {
                res.status(200).json({ study: true });
            } else {
                res.status(200).json({ study: false });
            }
        } catch (err) {
            conn.rollback()
            res.status(400).json(err.toString());
        } finally {
            conn.release()
        }
      });

      // ดูคะแนนรีวิววิชา
      router.post("/student/subject/rating/view", async function (req, res, next) {
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
        let sql = `
        SELECT studies.rating_study FROM studies WHERE study_id = ?;
        `
        try {
            const [rating] = await conn.query(sql, [study_id])

            conn.commit()
            res.status(200).json({'rating': rating[0].rating_study})
        } catch (err) {
            conn.rollback()
            res.status(400).json(err.toString());
        } finally {
            conn.release()
        }
      });



        // ให้คะแนนรีวิววิชา
        router.post("/student/subject/rating", async function (req, res, next) {
            const Schema = Joi.object({
                tutor_id: Joi.any().required(),
                study_id: Joi.any().required(),
                rating: Joi.number().integer().min(1).max(5).required(),
                subject_id: Joi.any().required(),
            })
            try {
                await Schema.validateAsync({ ...req.body }, { abortEarly: false })
            } catch (err) {
                return res.status(400).send(err)
            }
            const conn = await pool.getConnection()
            await conn.beginTransaction()
            const tutor_id = req.body.tutor_id
            const study_id = req.body.study_id
            const rating = req.body.rating
            const subject_id = req.body.subject_id
            try {
                await conn.query(
                    'UPDATE studies SET rating_study = ? WHERE study_id = ?',
                    [rating, study_id]
                );
                await conn.query(
                    'UPDATE subjects s SET s.rating_subject = (SELECT AVG(studies.rating_study) FROM studies WHERE studies.subject_id = ?) WHERE s.subject_id = ?',
                    [subject_id, subject_id]
                );
                await conn.query(
                    'UPDATE tutors t SET t.rating_score = (SELECT AVG(s.rating_subject) FROM subjects s WHERE s.tutor_id = ?) WHERE t.tutor_id = ?',
                    [tutor_id, tutor_id]
                );
                conn.commit()
                res.status(200).json({ message: 'ให้คะแนนวิชาสำเร็จ' });
            } catch (err) {
                conn.rollback()
                res.status(400).json(err.toString());
            } finally {
                conn.release()
            }
          });


    // ให้คะแนนรีวิว
    router.post("/student/rating", async function (req, res, next) {
        const Schema = Joi.object({
            account_id: Joi.any().required(),
            tutor_id: Joi.any().required(),
            score: Joi.number().integer().min(1).max(5).required(),
        })
        try {
            await Schema.validateAsync({ ...req.body }, { abortEarly: false })
        } catch (err) {
            return res.status(400).send(err)
        }
        const conn = await pool.getConnection()
        await conn.beginTransaction()
        const account_id = req.body.account_id
        const tutor_id = req.body.tutor_id
        const score = req.body.score
        try {
            const [existingRating] = await conn.query(
                'SELECT rating_id FROM ratings WHERE account_id = ? AND tutor_id = ?',
                [account_id, tutor_id]
            );
            if (existingRating.length > 0) {
                //อัปเดตคะแนน
                await conn.query(
                    'UPDATE ratings SET score = ?, timestamp = current_timestamp() WHERE account_id = ? AND tutor_id = ?',
                    [score, account_id, tutor_id]
                );
            } else {
                //เพิ่มข้อมูล
                await conn.query(
                    'INSERT INTO ratings(account_id, tutor_id, score, timestamp) VALUES (?, ?, ?, current_timestamp())',
                    [account_id, tutor_id, score]
                );
            }
            await conn.query(
                'UPDATE tutors t SET t.rating_score = (SELECT AVG(r.score) FROM ratings r WHERE r.tutor_id = ?) WHERE t.tutor_id = ?',
                [tutor_id, tutor_id]
            );
            conn.commit()
            res.status(200).json({ message: 'ให้คะแนนผู้สอนสำเร็จ' });
        } catch (err) {
            conn.rollback()
            res.status(400).json(err.toString());
        } finally {
            conn.release()
        }
      });

      // ดึงคะแนนรีวิว
      router.post("/student/getRating", async function (req, res, next) {
        const Schema = Joi.object({
            account_id: Joi.any().required(),
            tutor_id: Joi.any().required(),
        })
        try {
            await Schema.validateAsync({ ...req.body }, { abortEarly: false })
        } catch (err) {
            return res.status(400).send(err)
        }
        const conn = await pool.getConnection()
        await conn.beginTransaction()
        const account_id = req.body.account_id
        const tutor_id = req.body.tutor_id
        try {
            const [rating] = await conn.query(
                'SELECT * FROM ratings WHERE account_id = ? AND tutor_id = ?',
                [account_id, tutor_id]
            );
            conn.commit()
            if (rating.length > 0) {
                res.status(200).json({ score: rating[0].score });
            } else {
                res.status(200).json({ score: 0 });
            }
        } catch (err) {
            conn.rollback()
            res.status(400).json(err.toString());
        } finally {
            conn.release()
        }
      });


    // ส่งcomment
    router.post("/student/comment", async function (req, res, next) {
        const Schema = Joi.object({
            account_id: Joi.any().required(),
            tutor_id: Joi.any().required(),
            message: Joi.any().required(),
        })
        try {
            await Schema.validateAsync({ ...req.body }, { abortEarly: false })
        } catch (err) {
            return res.status(400).send(err)
        }
        const conn = await pool.getConnection()
        await conn.beginTransaction()
        console.log(req.body)
        const account_id = req.body.account_id
        const tutor_id = req.body.tutor_id
        const message = req.body.message
        try {
            await conn.query(
                'INSERT INTO comments(account_id, tutor_id, message) VALUES (?, ?, ?)',
                [account_id, tutor_id, message]
            )
            let sql = `SELECT comments.*, accounts.portrait_path, accounts.firstname, accounts.lastname
            FROM comments
            JOIN accounts ON comments.account_id = accounts.account_id
            WHERE comments.tutor_id=? ORDER BY comments.timestamp DESC`
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

      // ลบ comment
        router.post("/student/comment/delete", async function (req, res, next) {
            const conn = await pool.getConnection()
            await conn.beginTransaction()
            const comment_id = req.body.comment_id
            try {
                await conn.query(
                    'DELETE FROM comments WHERE comment_id = ?;',
                    [comment_id]
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

       // ดูประกาศ
       router.post("/student/announce", async function (req, res, next) {
        // const Schema = Joi.object({
        //     account_id: Joi.any().required(),
        //     status: Joi.optional(),
        //     degree: Joi.optional(),
        //     school_name: Joi.string().required(),
        //     honor: Joi.optional(),
        //     grade: Joi.optional(),
        // })
        // try {
        //     await Schema.validateAsync({ ...req.body }, { abortEarly: false })
        // } catch (err) {
        //     return res.status(400).send(err)
        // }
        const conn = await pool.getConnection()
        await conn.beginTransaction()
        const account_id = req.body.account_id
        try {
            const [announces] = await conn.query(
                'SELECT announces.*, accounts.firstname, accounts.lastname FROM announces JOIN accounts ON announces.account_id = accounts.account_id WHERE announces.account_id=? ORDER BY announces.announce_id DESC', 
                [account_id]
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

    // เพิ่มประกาศ
        router.post("/student/announce/add", async function (req, res, next) {
            // const Schema = Joi.object({
            //     account_id: Joi.any().required(),
            //     status: Joi.optional(),
            //     degree: Joi.optional(),
            //     school_name: Joi.string().required(),
            //     honor: Joi.optional(),
            //     grade: Joi.optional(),
            // })
            // try {
            //     await Schema.validateAsync({ ...req.body }, { abortEarly: false })
            // } catch (err) {
            //     return res.status(400).send(err)
            // }
            const conn = await pool.getConnection()
            await conn.beginTransaction()
            console.log(req.body)
            const account_id = req.body.account_id
            const subject_to_learn = req.body.subject_to_learn
            const place_to_learn = req.body.place_to_learn
            const student_age = req.body.student_age
            const student_degree = req.body.student_degree
            const convenient_day = req.body.convenient_day
            const convenient_time = req.body.convenient_time
            const learning_style = req.body.learning_style
            const starting_time = req.body.starting_time
            const objective = req.body.objective
            try {
                await conn.query(
                    'INSERT INTO announces(account_id, subject_to_learn, place_to_learn, student_age, student_degree, convenient_day, convenient_time, learning_style, starting_time, objective) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [account_id, subject_to_learn, place_to_learn, student_age, student_degree, convenient_day, convenient_time, learning_style, starting_time, objective]
                )
                const [announces] = await conn.query(
                    'SELECT announces.*, accounts.firstname, accounts.lastname FROM announces JOIN accounts ON announces.account_id = accounts.account_id WHERE announces.account_id=? ORDER BY announces.announce_id DESC', 
                    [account_id]
                )
                console.log(announces)
                conn.commit()
                res.status(200).json({'announces': announces, message: "ลงประกาศแล้ว" })
            } catch (err) {
                conn.rollback()
                res.status(400).json(err.toString());
            } finally {
                conn.release()
            }
  });

   // ลบประกาศ
   router.post("/student/announce/del", async function (req, res, next) {
    const announce_id = req.body.announce_id
    console.log(announce_id)
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    try {
        await conn.query(
            `DELETE FROM announces WHERE announce_id =?`,
            [announce_id]
        )
        conn.commit()
        res.status(200).json({ message: "ลบประกาศแล้ว" });
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
});





 





exports.router = router;
