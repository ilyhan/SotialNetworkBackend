const authService = require("../services/auth.service");
const { validationResult } = require('express-validator');

class AuthController {
    async createUser(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.errors[0].msg });
            }

            const user = await authService.createUser(req.body);
            return res.status(201).json(user);
        } catch (e) {
            return res.status(500).json({ error: "Произошла ошибка регистрации пользователя", message: e.message });
        }
    }

    async login(req, res) {
        try {
            const token = await authService.login(req.body);
            return res.json({ token });
        } catch (e) {
            return res.status(500).json({ error: "Произошла ошибка авторизации пользователя", message: e.message });
        }
    }

    async refresh(req, res) {
        try {
            const { id, username } = req.user;
            res.status(200).json({ id: id, user: username });
        } catch (e) {
            return res.status(500).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }
}

module.exports = new AuthController();