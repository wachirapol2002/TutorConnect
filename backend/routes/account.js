const express = require("express");
const pool = require("../DBconfig");
const Joi = require('joi')
const bcrypt = require('bcrypt')
const upload = require("../multer");
const fs = require('fs');
const path = require('path');

router = express.Router();

//Login
router.post('/user/login', async (req, res, next) => {
    const loginSchema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    })
    try {
        await loginSchema.validateAsync(req.body, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const username = req.body.username
    const password = req.body.password

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try {
        // Check if username is correct
        const [accounts] = await conn.query(
            'SELECT * FROM accounts WHERE username=?', 
            [username]
        )
        const account = accounts[0]
        if (!account) {    
            throw new Error('ไม่มี "ชื่อผู้ใช้งาน" นี้')
        }
        // Check if password is correct
        if (!(await bcrypt.compare(password, account.password))) {
            throw new Error('"ชื่อผู้ใช้" หรือ "รหัสผ่าน" ไม่ถูกต้อง')
        }
        let tutor_id = null;
        if (account.permission === 'ติวเตอร์'){
            const [tutors] = await conn.query(
                'SELECT tutor_id FROM tutors WHERE account_id = ?',
                [account.account_id])
            tutor_id = tutors[0].tutor_id
        }
        
        conn.commit()
        res.status(200).json({'account': account,'tutor_id': tutor_id})
    } catch (error) {
        conn.rollback()
        res.status(403).json({ message: error.message })
    } finally {
        conn.release()
    }
})

//ProfileEdit
router.post('/user/edit', upload.single('portrait'), async (req, res, next) => {
    const editSchema = Joi.object({
        username: Joi.string().required(),
        firstname: Joi.string().max(100).required(),
        lastname: Joi.string().max(100).required(),
        gender: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required().pattern(/0[0-9]{9}/),
        portrait: Joi.any().optional()
    })
    try {
        await editSchema.validateAsync({ ...req.body, portrait: req.file }, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    const file = req.file;
    const username = req.body.username;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const gender = req.body.gender;
    const email = req.body.email;
    const phone = req.body.phone;
    try {
        if (!file) {
            await conn.query(
                'UPDATE accounts SET firstname=?, lastname=?, gender=?, email=?, phone=? WHERE username=?;',
                [firstname, lastname, gender, email, phone, username]
            )
        }else{
            // const [accounts] = await conn.query(
            //     'SELECT * FROM accounts WHERE username=?', 
            //     [username]
            // );
            // const account = accounts[0];
            // // bugลบไฟล์
            // if (account.portrait_path) {
            //     const filePath = path.join(__dirname, '/static/portraits/portrait-1736282044705.png');
            //     fs.unlink(filePath, (err) => {
            //         if (err) {
            //           console.error('Error deleting old file:', err);
            //         } else {
            //           console.log('Old file deleted successfully');
            //         }
            //       });
            // }
            const portrait_path = '/static/portraits/' + file.filename;
            await conn.query(
                'UPDATE accounts SET portrait_path=?, firstname=?, lastname=?, gender=?, email=?, phone=? WHERE username=?;',
                [portrait_path, firstname, lastname, gender, email, phone, username]
            )
        }
        const [accounts] = await conn.query(
            'SELECT * FROM accounts WHERE username=?', 
            [username]
        )
        const account = accounts[0]
        conn.commit()
        res.status(200).json({'account': account,})
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
})


// chatที่เคยคุยด้วย
router.post('/chat/account', async (req, res, next) => {
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
        let sql = `
        SELECT 
            m.message_id,
            m.sender_id,
            m.receiver_id,
            m.message_text,
            m.timestamp,
            
            CASE 
                WHEN m.sender_id = ? THEN a2.account_id 
                ELSE a1.account_id 
            END AS partner_id,
            
            CASE 
                WHEN m.sender_id = ? THEN a2.portrait_path 
                ELSE a1.portrait_path 
            END AS partner_portrait,

            CASE 
                WHEN m.sender_id = ? THEN a2.username 
                ELSE a1.username 
            END AS partner_username,

            CASE 
                WHEN m.sender_id = ? THEN a2.permission
                ELSE a1.permission
            END AS partner_permission,

            CASE 
                WHEN m.sender_id = ? THEN a2.firstname
                ELSE a1.firstname
            END AS partner_firstname,

            CASE 
                WHEN m.sender_id = ? THEN a2.lastname
                ELSE a1.lastname
            END AS partner_lastname,

            CASE 
                WHEN m.sender_id = ? THEN a2.gender
                ELSE a1.gender
            END AS partner_gender,

            CASE 
                WHEN m.sender_id = ? THEN t2.displayname 
                ELSE t1.displayname 
            END AS partner_displayname

        FROM messages m
        JOIN (
            SELECT 
                CASE 
                    WHEN sender_id = ? THEN receiver_id
                    ELSE sender_id
                END AS partner_id, 
                MAX(timestamp) AS latest_timestamp
            FROM messages
            WHERE sender_id = ? OR receiver_id = ?
            GROUP BY partner_id
        ) latest_messages
        ON (
            (m.sender_id = ? AND m.receiver_id = latest_messages.partner_id) 
            OR (m.receiver_id = ? AND m.sender_id = latest_messages.partner_id)
        )
        AND m.timestamp = latest_messages.latest_timestamp

        LEFT JOIN accounts a1 ON m.sender_id = a1.account_id
        LEFT JOIN accounts a2 ON m.receiver_id = a2.account_id

        LEFT JOIN tutors t1 ON a1.account_id = t1.account_id
        LEFT JOIN tutors t2 ON a2.account_id = t2.account_id

        ORDER BY m.timestamp DESC;
        `
        const [accounts] = await conn.query(sql,[account_id, account_id, account_id, account_id, account_id, account_id, account_id, account_id, account_id, account_id, account_id, account_id, account_id])


        conn.commit()
        res.status(200).json({'accounts': accounts})
    } catch (error) {
        conn.rollback()
        res.status(403).json({ message: error.message })
    } finally {
        conn.release()
    }
})

//chat
router.post('/chat/receiver', async (req, res, next) => {
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
        let sql = `
        SELECT
            accounts.account_id,
            accounts.portrait_path,
            accounts.username,
            accounts.permission,
            accounts.firstname,
            accounts.lastname,
            accounts.gender,
            tutors.displayname
        FROM accounts
        LEFT JOIN tutors ON accounts.account_id = tutors.account_id
        WHERE accounts.account_id =?;
        `
        // Check if username is correct
        const [receiver] = await conn.query(sql,[account_id])

        conn.commit()
        res.status(200).json({'receiver': receiver[0]})
    } catch (error) {
        conn.rollback()
        res.status(403).json({ message: error.message })
    } finally {
        conn.release()
    }
})

//chat
router.post('/chat/send', async (req, res, next) => {
    const Schema = Joi.object({
        sender_id: Joi.any().required(),
        receiver_id: Joi.any().required(),
        message: Joi.any().required(),
    })
    try {
        await Schema.validateAsync({ ...req.body }, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    const sender_id =req.body.sender_id
    const receiver_id =req.body.receiver_id
    const message =req.body.message
    await conn.query(
        `UPDATE messages SET is_read = '1' WHERE sender_id = ? AND receiver_id = ?;`,
        [receiver_id, sender_id]
    )
    try {
        let sql = `
        INSERT INTO messages (sender_id, receiver_id, message_text)
            VALUES (?, ?, ?);
        `
        // Check if username is correct
        const [messages] = await conn.query(sql, [sender_id, receiver_id , message])

        conn.commit()
        res.status(200).json()
    } catch (error) {
        conn.rollback()
        res.status(403).json({ message: error.message })
    } finally {
        conn.release()
    }
})

//chat
router.post('/chat/history', async (req, res, next) => {
    const Schema = Joi.object({
        sender_id: Joi.any().required(),
        receiver_id: Joi.any().required(),
    })
    try {
        await Schema.validateAsync({ ...req.body }, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    const sender_id =req.body.sender_id
    const receiver_id =req.body.receiver_id
    
    try {
        await conn.query(
            `UPDATE messages SET is_read = '1' WHERE sender_id = ? AND receiver_id = ?;`,
            [receiver_id, sender_id]
        )
        let sql = `
        SELECT 
            m.message_id,
            m.sender_id,
            m.receiver_id,
            m.message_text,
            m.attachment_path,
            m.is_read,
            m.timestamp
        FROM messages m
        WHERE 
            (m.sender_id = ? AND m.receiver_id = ?)
            OR 
            (m.sender_id = ? AND m.receiver_id = ?)
        ORDER BY m.timestamp ASC;
        `
        // Check if username is correct
        const [messages] = await conn.query(sql, [sender_id, receiver_id, receiver_id, sender_id])

        conn.commit()
        res.status(200).json({'messages': messages})
    } catch (error) {
        conn.rollback()
        res.status(403).json({ message: error.message })
    } finally {
        conn.release()
    }
})







exports.router = router;
