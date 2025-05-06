
const SUPPORT_QUERY = {
    addMessage: 
        `INSERT INTO support 
         (user_id, description) 
         values ($1, $2) 
         RETURNING *
        `,
}

module.exports = SUPPORT_QUERY;