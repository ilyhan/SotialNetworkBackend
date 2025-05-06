const Router = require('express');
const postController = require('../controller/post.controller');
const postRouter = new Router();
const authorization = require('../middlewares/authorization');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

postRouter.post('/newpost', [authorization, upload.array('images', 10)], postController.createPost);
postRouter.post('/post/like', authorization, postController.likes);
postRouter.get('/infinity-post', authorization, postController.getInfinityPosts);
postRouter.delete('/delete-post', authorization, postController.deletePost);
postRouter.get('/favorites', authorization, postController.getFavoritesPosts);

module.exports = postRouter;