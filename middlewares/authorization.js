const jwt = require('jsonwebtoken');
const { secret } = require('../config');

function authorization(req, res, next) {
    const token = req.cookies.token;
    console.log(req.cookies.token, req)
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