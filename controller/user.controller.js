const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { secret } = require('../config');

const generateAccessToken = (id) => {
    const payload = {
        id,
    }

    return jwt.sign(payload, secret, { expiresIn: "1d" });
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
            return res.status(400).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }

    async createPost(req, res) {
        try {
            const {
                content,
            } = req.body;
            const { id } = req.user;

            const result = await db.query('INSERT INTO posts (user_id, content) values ($1, $2) RETURNING *', [id, content]);

            if (!result.rows.length) {
                return res.status(400).json({ message: "Ошибка записи данных" });
            }
            return res.json(result);
        } catch (e) {
            return res.status(400).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }

    async getAllPosts(req, res) {
        try {
            const { id } = req.user;

            const result = await db.query(`
                SELECT 
                    p.id, 
                    p.user_id,
                    p.content,
                    p.media_content, 
                    p.likes_count,
                    p.created_at,
                    EXISTS (SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = $1) AS liked
                FROM 
                    posts p
                ORDER BY 
                    p.created_at DESC
            `, [id]);

            res.json(result.rows);
        } catch (e) {
            return res.status(400).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }

    async likes(req, res) {
        const { post_id } = req.body;
        const { id: user_id } = req.user;

        try {
            const result = await db.query('SELECT * FROM likes WHERE user_id = $1 AND post_id = $2', [user_id, post_id]);

            if (result.rows.length > 0) {
                await db.query('DELETE FROM likes WHERE user_id = $1 AND post_id = $2', [user_id, post_id]);
                await db.query('UPDATE posts SET likes_count = likes_count - 1 WHERE id = $1', [post_id]);
                return res.json({ message: 'Лайк удален' });
            } else {
                await db.query('INSERT INTO likes (user_id, post_id) VALUES ($1, $2)', [user_id, post_id]);
                await db.query('UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1', [post_id]);
                return res.json({ message: 'Пост лайкнут' });
            }
        } catch (e) {
            return res.status(500).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }
}

module.exports = new UserController();
