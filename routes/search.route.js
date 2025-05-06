const Router = require('express');
const searchRouter = new Router();
const authorization = require('../middlewares/authorization');
const searchController = require('../controller/search.controller');

searchRouter.get('/search/:searchText', authorization, searchController.searchUser);

module.exports = searchRouter;