const POST_QUERY = require("../query/post.query");
const db = require('../db');
const {
    ref,
    uploadBytes,
    getDownloadURL,
} = require('firebase/storage');
const { auth } = require('../firebase.config');

class PostService {
    async createUser(id, files, content) {
        let result;

        if (files.length) {
            const urls = [];

            for (const file of files) {
                const filename = new Date().getTime();
                const imageRef = ref(auth, 'posts/' + filename);
                const snapshot = await uploadBytes(imageRef, file.buffer);
                const imageURL = await getDownloadURL(snapshot.ref);
                urls.push(imageURL);
            }

            result = await db.query(POST_QUERY.createWithMedia, [id, content, urls]);

        } else {
            result = await db.query(POST_QUERY.create, [id, content]);
        }

        return result;
    }

    async addLike(user_id, post_id) {
        await db.query(POST_QUERY.setLike, [user_id, post_id]);
        await db.query(POST_QUERY.updateLikeInc, [post_id]);
    }

    async deleteLike(user_id, post_id) {
        await db.query(POST_QUERY.deleteLike, [user_id, post_id]);
        await db.query(POST_QUERY.updateLikeDec, [post_id]);
    }

    async useLike(user_id, post_id) {
        const result = await db.query(POST_QUERY.getLikes, [user_id, post_id]);

        if (result.rows.length > 0) {
            this.deleteLike(user_id, post_id);
            return { message: 'Лайк удален', is_liked: false, post_id }
        } else {
            this.addLike(user_id, post_id);
            return { message: 'Пост лайкнут', is_liked: true, post_id }
        }
    }

    async getFavorites(id) {
        const result = await db.query(POST_QUERY.getFavorites, [id]);
        return result;
    }

    async getInfinityPosts(id, limit, offset) {
        const result = await db.query(POST_QUERY.getInfinity, [id, limit, offset]);
        return result;
    }

    async getPostMedia(user_id, post_id) {
        const result = await db.query(POST_QUERY.getMedia, [post_id, user_id]);
        return result.rows[0].media_content;
    }

    async deleteLikes(post_id) {
        await db.query(POST_QUERY.deleteLikes, [post_id]);
    }

    async deletePost(user_id, post_id) {
        await db.query(POST_QUERY.delete, [post_id, user_id]);
    }

    async getByUser(id) {
        const result = await db.query(POST_QUERY.getByUser, [id]);
        return result;
    }
}

module.exports = new PostService;