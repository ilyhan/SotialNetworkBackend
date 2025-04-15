const jwt = require('jsonwebtoken');
const { secret } = require('../config');

function authorization(req, res, next) {
    const tokenHeader = req.headers.authorization;

    if(!tokenHeader) {
        return res.status(401).json({message: 'Пользователь не авторизован'});
    }

    token = tokenHeader.split(' ')[1];

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.status(401).json({message: 'Пользователь не авторизован'});
        }

        req.user = user;
        next();
    });
}

module.exports = authorization; 