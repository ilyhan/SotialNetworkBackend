const db = require('../db');
const {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} = require('firebase/storage');
const { auth } = require('../firebase.config');
const USER_QUERY = require('../query/user.query');

class UserService {
    async getUsernameById(id) {
        const result = await db.query(USER_QUERY.getUsernameById, [id]);
        return result;
    }

    async getFullInfo(id, username) {
        const result = await db.query(USER_QUERY.getFullInfo, [id, username]);
        return result;
    }

    async getAvater(id) {
        const result = await db.query(USER_QUERY.getAvatar, [id]);
        return result;
    }

    async updateAvatar(id, imageURL) {
        await db.query(USER_QUERY.updateAvatar, [id, imageURL]);
    }

    async getBackground(id) {
        const result = await db.query(USER_QUERY.getBackground, [id]);
        return result;
    }

    async updateBackground(id, imageURL) {
        await db.query(USER_QUERY.updateBackground, [id, imageURL]);
    }

    async updateDescription(id, description) {
        await db.query(USER_QUERY.updateDescription, [id, description]);
    }
}

module.exports = new UserService();