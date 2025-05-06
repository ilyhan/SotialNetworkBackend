const Router = require('express');
const router = new Router();
const userController = require('../controller/user.controller');
const authorization = require('../middlewares/authorization');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/users/:username', authorization, userController.getUser);
router.post('/avatar', [authorization, upload.single('images')], userController.setAvatar);
router.post('/background', [authorization, upload.single('images')], userController.setBackground);
router.post('/description', authorization, userController.setDescriptionProfile);

module.exports = router;