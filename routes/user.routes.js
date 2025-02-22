const Router = require('express');
const router = new Router();
const userController = require('../controller/user.controller');
const { check } = require('express-validator');
const authorization = require('../middlewares/authorization');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/user', [
    check('first_name', "Имя пользователя не может быть пусто").notEmpty(),
    check('last_name', "Фамилия пользователя не может быть пуста").notEmpty(),
    check('username', "Ник пользователя не может быть пуст").notEmpty(),
    check('email', "Некорректные данные в поле почта").isEmail(),
    check('password', "Пароль должен быть больше 5 и меньше 15 символов").isLength({ min: 5, max: 15 }),
], userController.createUser);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', authorization, userController.refresh);
router.post('/newpost', [authorization, upload.array('images', 10)], userController.createPost);
router.get('/posts', authorization, userController.getAllPosts);
router.post('/post/like', authorization, userController.likes);
router.get('/users/:username', authorization, userController.getUser);
router.post('/follow', authorization, userController.follow);
router.get('/search/:searchText', authorization, userController.search);
router.post('/avatar', [authorization, upload.single('images')], userController.setAvatar);
router.post('/background', [authorization, upload.single('images')], userController.setBackground);
router.post('/description', authorization, userController.setDescriptionProfile);
router.post('/support', authorization, userController.newSupportMessage);
router.get('/favorites', authorization, userController.getFavoritesPosts);
router.get('/followers/:user_id', authorization, userController.getFollowers);
router.get('/following/:user_id', authorization, userController.getFollowing);
router.get('/infinity-post', authorization, userController.getInfinityPosts);
router.delete('/delete-post', authorization, userController.deletePost);

module.exports = router;