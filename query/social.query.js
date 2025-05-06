
const SOCIAL_QUERY = {
    checkFollowing: 
        `SELECT * 
         FROM followers 
         WHERE follower_id = $1 AND followee_id = $2
        `,

    deleteFollow: 
        `DELETE FROM followers 
         WHERE follower_id = $1 AND followee_id = $2
        `,
    
    addFollow: 
        `INSERT INTO followers 
         (follower_id, followee_id) 
         VALUES ($1, $2)
        `,

    getFollowers: 
        `SELECT u.username, 
          u.avatar,
          u.first_name,
          u.last_name,
          u.id
         FROM followers f
         JOIN users u ON u.id = f.follower_id
         WHERE followee_id = $1
        `,

    getFollowing: 
        `SELECT u.username, 
          u.avatar,
          u.first_name,
          u.last_name,
          u.id
         FROM followers f
         JOIN users u ON u.id = f.followee_id
         WHERE follower_id = $1
        `,
}

module.exports = SOCIAL_QUERY;