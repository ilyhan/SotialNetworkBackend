const Router = require('express');
const router = new Router();
const userController = require('../controller/user.controller');
const { check } = require('express-validator');
const authorization = require('../middlewares/authorization');

router.post('/user', [
    check('first_name', "Имя пользователя не может быть пусто").notEmpty(),
    check('last_name', "Фамилия пользователя не может быть пуста").notEmpty(),
    check('username', "Ник пользователя не может быть пуст").notEmpty(),
    check('email', "Некорректные данные в поле почта").isEmail(),
    check('password', "Пароль должен быть больше 5 и меньше 15 символов").isLength({min: 5, max: 15}),
], userController.createUser);
router.post('/login', userController.login);
router.post('/refresh', authorization, userController.refresh);
// router.get('/user/:nickname', userController.getUser);
// router.get('/message', userController.getMessages);

module.exports = router;