const Router = require('express');
const router = new Router();
const userController = require('../controller/user.controller');
const { check } = require('express-validator');

router.post('/user', [
    check('first_name', "Имя пользователя не может быть пусто").notEmpty(),
    check('last_name', "Фамилия пользователя не может быть пуста").notEmpty(),
    check('username', "Ник пользователя не может быть пуст").notEmpty(),
    check('email', "Почта не может быть пуста").notEmpty(),
    check('password', "Пароль должен быть больше 5 и меньше 15 символов").isLength({min: 5, max: 15}),
], userController.createUser);
// router.get('/user/:nickname', userController.getUser);
// router.post('/message', userController.createMessage);
// router.get('/message', userController.getMessages);

module.exports = router;