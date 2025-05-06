const searchService = require("../services/search.service");

class SearchController {
    async searchUser(req, res) {
        try {
            let searchText = "%" + req.params.searchText + "%";

            const result = await searchService.searchUser(searchText);
            return res.json(result.rows);
        } catch (e) {
            return res.status(500).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }
}

module.exports = new SearchController();