
const USER_QUERY = {
    getUsername:
        `SELECT username 
         FROM users 
         WHERE username = $1
        `,

    getUsernameById:
        `SELECT username 
         FROM users 
         WHERE id = $1
        `,

    getAvatar:
        `SELECT avatar 
         FROM users 
         WHERE id = $1
        `,

    getBackground: 
        `SELECT background_image 
         FROM users 
         WHERE id = $1
        `,

    get:
        `SELECT * 
         FROM users 
         WHERE username = $1
        `,

    getFullInfo: `
        SELECT u.id,
            u.first_name,
            u.last_name,
            u.username,
            u.avatar,
            u.background_image, 
            (SELECT COUNT(*) FROM followers WHERE followee_id = u.id) AS follower_count,
            (SELECT COUNT(*) FROM followers WHERE follower_id = u.id) AS following_count,
            CASE 
                WHEN (SELECT COUNT(*) FROM followers WHERE follower_id = $1 AND followee_id = u.id) > 0 THEN TRUE 
                ELSE FALSE 
            END AS is_following
        FROM users u
        WHERE u.username = $2
    `,

    create:
        `INSERT INTO users 
         (first_name, last_name, username, email, password) 
         values ($1, $2, $3, $4, $5) 
         RETURNING *
        `,

    updateAvatar:
        `UPDATE users 
         SET avatar = $2 
         WHERE id = $1
        `,

    updateBackground:
        `UPDATE users 
         SET background_image = $2 
         WHERE id = $1
        `,

    updateDescription:
        `UPDATE users 
         SET description = $2 
         WHERE id = $1
        `,
}

module.exports = USER_QUERY;