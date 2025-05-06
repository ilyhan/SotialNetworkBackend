
const POST_QUERY = {
    createWithMedia:
        `INSERT INTO posts 
         (user_id, content, media_content) 
         values ($1, $2, $3) 
         RETURNING *
        `,

    create:
        `INSERT INTO posts 
         (user_id, content) 
         values ($1, $2) 
         RETURNING *
        `,
    
    getByUser:
        `SELECT * 
         FROM posts 
         WHERE user_id = $1 
         ORDER BY created_at DESC
        `,

    getAll:
        `SELECT 
         p.id, 
         p.user_id,
         p.content,
         p.media_content, 
         p.likes_count,
         p.created_at,
         EXISTS (SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = $1) AS liked,
         users.username, 
         users.avatar,
         users.first_name,
         users.last_name
         FROM 
            posts p
         JOIN users ON p.user_id = users.id
         ORDER BY 
            p.created_at DESC
        `,

    getFavorites:
        `SELECT p.*,                     
          users.username, 
          users.avatar,
          users.first_name,
          users.last_name, 
          1 as liked 
         FROM posts p
         JOIN likes l ON l.post_id = p.id
         JOIN users ON p.user_id = users.id
         WHERE l.user_id = $1
         ORDER BY 
            p.created_at DESC
        `,
    
    getLikes: 
        `SELECT * 
         FROM likes 
         WHERE user_id = $1 AND post_id = $2
        `,
    
    deleteLike: 
        `DELETE FROM likes 
         WHERE user_id = $1 AND post_id = $2
        `,

    setLike: `INSERT INTO likes (user_id, post_id) VALUES ($1, $2)`,

    updateLikeInc: 
        `UPDATE posts 
         SET likes_count = likes_count + 1 
         WHERE id = $1
        `,
                   
    updateLikeDec: 
        `UPDATE posts 
         SET likes_count = likes_count - 1 
         WHERE id = $1
        `,

    getInfinity: 
        `SELECT 
          p.id, 
          p.user_id,
          p.content,
          p.media_content, 
          p.likes_count,
          p.created_at,
          EXISTS (SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = $1) AS liked,
          users.username, 
          users.avatar,
          users.first_name,
          users.last_name
         FROM 
             posts p
         JOIN users ON p.user_id = users.id
         ORDER BY 
             p.created_at DESC
         LIMIT $2 OFFSET $3
        `,

    getMedia: 
        `SELECT media_content FROM posts
         WHERE id = $1 AND user_id = $2
        `,

    deleteLikes: 
        `DELETE FROM likes
         WHERE post_id = $1
        `,
    
    delete: 
        `DELETE FROM posts
         WHERE id = $1 AND user_id = $2
        `,
}

module.exports = POST_QUERY;