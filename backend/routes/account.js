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
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
})

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
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
})

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
        conn.commit()
        res.status(200).json({'account': account})
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
})

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
        conn.commit()
        res.status(200).json({'account': account})
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


exports.router = router;
