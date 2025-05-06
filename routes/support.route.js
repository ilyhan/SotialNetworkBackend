const Router = require('express');
const supportRouter = new Router();
const authorization = require('../middlewares/authorization');
const supportController = require('../controller/support.controller');

supportRouter.post('/support', authorization, supportController.newSupportMessage);

module.exports = supportRouter;