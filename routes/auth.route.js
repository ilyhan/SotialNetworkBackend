const Router = require('express');
const authRouter = new Router();
const authController = require('../controller/auth.controller');
const { check } = require('express-validator');
const authorization = require('../middlewares/authorization');

authRouter.post('/user', [
    check('first_name', "Имя пользователя не может быть пусто").notEmpty(),
    check('last_name', "Фамилия пользователя не может быть пуста").notEmpty(),
    check('username', "Ник пользователя не может быть пуст").notEmpty(),
    check('email', "Некорректные данные в поле почта").isEmail(),
    check('password', "Пароль должен быть больше 5 и меньше 15 символов").isLength({ min: 5, max: 15 }),
], authController.createUser);
authRouter.post('/login',[
    check('username', "Ник пользователя не может быть пуст").notEmpty(),
    check('password', "Пароль должен быть больше 5 и меньше 15 символов").isLength({ min: 5, max: 15 }),
], authController.login);
authRouter.get('/refresh', authorization, authController.refresh);

module.exports = authRouter;