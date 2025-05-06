const supportService = require("../services/support.service");

class SupportController {
    async newSupportMessage(req, res) {
        try {
            const { id } = req.user;
            const { message } = req.body;

            const result = await supportService.addMessage(id, message);

            if (!result.rows.length) {
                return res.status(400).json({ message: "Ошибка запроса к БД" });
            }
            return res.json();
        } catch (e) {
            return res.status(500).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }
}

module.exports = new SupportController();