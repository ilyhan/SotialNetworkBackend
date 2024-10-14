const db = require('../db');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

class UserController {
    async createUser(req, res) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({error: errors.errors[0].msg});
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
}

module.exports = new UserController();
