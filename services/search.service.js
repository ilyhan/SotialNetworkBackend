const db = require('../db');
const SEARCH_QUERY = require('../query/search.query');

class SearchService {
    async searchUser(searchText) {
        const result = await db.query(SEARCH_QUERY.searchUser, [searchText]);
        return result;
    }
}

module.exports = new SearchService();