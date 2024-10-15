const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { secret } = require('../config');

const generateAccessToken = (id) => {
    const payload = {
        id,
    }

    return jwt.sign(payload, secret, { expiresIn: "220s" });
}

class UserController {
    async createUser(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.errors[0].msg });
            }

            const {
                first_name,
                last_name,
                username,
                email,
                password
            } = req.body;

            const result = await db.query('SELECT username FROM users WHERE username = $1', [username]);
            if (result.rows.length > 0) {
                return res.status(400).json({ message: "Пользователь с таким Никнеймом уже существует" });
            }

            const hashPassword = bcrypt.hashSync(password, 7);
            const newUser = await db.query('INSERT INTO users (first_name, last_name, username, email, password) values ($1, $2, $3, $4, $5) RETURNING *', [first_name, last_name, username, email, hashPassword]);
            return res.json(newUser.rows);
        } catch (e) {
            return res.status(400).json({ message: "Произошла ошибка при создании пользователя", error: e.message });
        }
    }

    async login(req, res) {
        try {
            const {
                username,
                password
            } = req.body;

            const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
            if (result.rows.length == 0) {
                return res.status(400).json({ message: "Пользователь с таким Никнеймом не найден" });
            }

            const user = result.rows[0];
            const validPassword = bcrypt.compareSync(password, user.password);

            if (!validPassword) {
                return res.status(400).json({ message: "Введен неверный пароль" });
            }

            const token = generateAccessToken(user.id);

            res.cookie('token', token, { httpOnly: true, secure: false });
            return res.json({ token });
        } catch (e) {
            return res.status(400).json({ message: "Произошла ошибка авторизации пользователя", error: e.message });
        }
    }

    async refresh(req, res) {
        try {
            const { id } = req.user;
            res.status(200).json(id);
        } catch (e) {
            return res.status(400).json({ message: "Произошла ошибка авторизации пользователя", error: e.message });
        }
    }
}

module.exports = new UserController();
