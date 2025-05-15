const jwt = require('jsonwebtoken');
const { secret } = require('../config');
const USER_QUERY = require('../query/user.query');
const bcrypt = require('bcryptjs');
const db = require('../db');

class AuthService {
    generateAccessToken = (id, username) => {
        const payload = {
            id,
            username,
        }

        return jwt.sign(payload, secret, { expiresIn: "1d" });
    }

    async createUser({ first_name, last_name, username, email, password }) {
        const result = await db.query(USER_QUERY.getUsername, [username]);

        if (result.rows.length > 0) throw new Error("Пользователь с таким Никнеймом уже существует");

        const hashPassword = bcrypt.hashSync(password, 7);

        const newUser = await db.query(
            USER_QUERY.create,
            [first_name, last_name, username, email, hashPassword]
        );

        return newUser;
    }

    async login({username, password}){
        const result = await db.query(USER_QUERY.get, [username]);
        if (result.rows.length == 0) throw new Error("Пользователь с таким Никнеймом не найден");

        const user = result.rows[0];
        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword) throw new Error("Введен неверный пароль");

        const token = this.generateAccessToken(user.id, username);
        return token;
    }
}

module.exports = new AuthService();