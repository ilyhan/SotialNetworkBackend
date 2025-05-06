const SUPPORT_QUERY = require("../query/support.query");
const db = require('../db');

class SupportService {
    async addMessage(id, message){
        const result = await db.query(SUPPORT_QUERY.addMessage, [id, message]);
        return result;
    }
}

module.exports = new SupportService();