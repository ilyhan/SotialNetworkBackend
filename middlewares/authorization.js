const jwt = require('jsonwebtoken');
const { secret } = require('../config');

function authorization(req, res, next) {
    const token = req.cookies.token;
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('Client IP:', clientIP);

    if(!token) {
        return res.status(401).json({message: 'Пользователь не авторизован'});
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.status(401).json({message: 'Пользователь не авторизован'});
        }

        req.user = user;
        next();
    });
}

module.exports = authorization; 