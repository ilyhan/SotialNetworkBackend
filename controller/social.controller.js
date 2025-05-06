const socialService = require("../services/social.service");

class SocialController {
    async follow(req, res) {
        try {
            const { id: followerId } = req.user;
            const { followedId } = req.body;

            const result = await socialService.follow(followerId, followedId);
            return res.json(result);
        } catch (e) {
            return res.status(500).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }

    async getFollowers(req, res) {
        try {
            const user_id = req.params.user_id;
            const result = await socialService.getFollowers(user_id);
            return res.json(result.rows);
        }
        catch (e) {
            return res.status(500).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }

    async getFollowing(req, res) {
        try {
            const user_id = req.params.user_id;
            const result = await socialService.getFollowing(user_id);
            return res.json(result.rows);
        }
        catch (e) {
            return res.status(500).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }
}

module.exports = new SocialController();