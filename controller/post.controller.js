const postService = require("../services/post.service");

class PostController {
    async createPost(req, res) {
        try {
            const files = req.files;
            const { content } = req.body;
            const { id } = req.user;

            const post = await postService.createUser(id, files, content);

            if (!post.rows.length) {
                return res.status(400).json({ message: "Ошибка записи данных" });
            }
            return res.json(post.rows);
        } catch (e) {
            return res.status(500).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }

    async likes(req, res) {
        try {
            const { post_id } = req.body;
            const { id: user_id } = req.user;

            const result = await postService.useLike(user_id, post_id);
            return res.json(result);
        } catch (e) {
            return res.status(500).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }

    async getFavoritesPosts(req, res) {
        try {
            const { id } = req.user;

            const result = await postService.getFavorites(id);
            return res.json(result.rows);
        }
        catch (e) {
            return res.status(500).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }

    async getInfinityPosts(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const { id } = req.user;

            if (isNaN(page) || isNaN(limit)) {
                return res.status(400).json({ message: "Неверные параметры page или limit" });
            }

            const offset = (page - 1) * limit;

            const result = await postService.getInfinityPosts(id, limit, offset);
            res.json(result.rows);
        }
        catch (e) {
            return res.status(500).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }

    async deletePost(req, res) {
        try {
            const { id } = req.user;
            const { post_id } = req.body;

            const media = await postService.getPostMedia(id, post_id);

            if (media) {
                for (let i = 0; i < media.length; i++) {
                    const oldAvatarURL = media[i];

                    const extractPathFromURL = (url) => {
                        const pathStart = url.indexOf('/o/') + 3;
                        const pathEnd = url.indexOf('?');
                        return decodeURIComponent(url.slice(pathStart, pathEnd));
                    };

                    if (oldAvatarURL) {
                        try {
                            const oldAvatarPath = extractPathFromURL(oldAvatarURL);
                            const oldFileRef = ref(auth, oldAvatarPath);
                            await deleteObject(oldFileRef);
                        } catch (deleteError) {
                            console.error('Ошибка при удалении старой аватарки:', deleteError.message);
                        }
                    }
                };
            }

            postService.deleteLikes(post_id);
            postService.deletePost(id, post_id);
            res.json({ message: 'Пост успешно удален' });
        }
        catch (e) {
            return res.status(500).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }
}

module.exports = new PostController();