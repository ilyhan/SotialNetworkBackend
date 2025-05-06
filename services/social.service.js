const db = require('../db');
const SOCIAL_QUERY = require('../query/social.query');

class SocialService {
    async follow(followerId, followedId) {
        const existingFollow = await db.query(SOCIAL_QUERY.checkFollowing, [followerId, followedId]);
        let isFollow = false;

        if (existingFollow.rowCount > 0) {
            await db.query(SOCIAL_QUERY.deleteFollow, [followerId, followedId]);
        } else {
            await db.query(SOCIAL_QUERY.addFollow, [followerId, followedId]);
            isFollow = true;
        }
        return { followed: isFollow };
    }

    async getFollowers(user_id) {
        const result = await db.query(SOCIAL_QUERY.getFollowers, [user_id]);
        return result;
    }

    async getFollowing(user_id) {
        const result = await db.query(SOCIAL_QUERY.getFollowing, [user_id]);
        return result;
    }
}

module.exports = new SocialService();