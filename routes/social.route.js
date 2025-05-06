const Router = require('express');
const socialRouter = new Router();
const authorization = require('../middlewares/authorization');
const socialController = require('../controller/social.controller');

socialRouter.post('/follow', authorization, socialController.follow);
socialRouter.get('/followers/:user_id', authorization, socialController.getFollowers);
socialRouter.get('/following/:user_id', authorization, socialController.getFollowing);

module.exports = socialRouter;