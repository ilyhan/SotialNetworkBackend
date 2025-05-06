
const SEARCH_QUERY = {
    searchUser: 
        `SELECT id, first_name, last_name, username, avatar 
         FROM users 
         WHERE username like $1
        `,
}

module.exports = SEARCH_QUERY;