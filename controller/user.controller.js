const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { secret } = require('../config');
const {
    ref,
    uploadBytes,
    getDownloadURL,
} = require('firebase/storage');
const { auth } = require('../firebase.config');

const generateAccessToken = (id, username) => {
    const payload = {
        id,
        username,
    }

    return jwt.sign(payload, secret, { expiresIn: "1d" });
}

class UserController {
    async createUser(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.errors[0].msg });
            }

            const {
                first_name,
                last_name,
                username,
                email,
                password
            } = req.body;

            const result = await db.query('SELECT username FROM users WHERE username = $1', [username]);
            if (result.rows.length > 0) {
                return res.status(400).json({ message: "Пользователь с таким Никнеймом уже существует" });
            }

            const hashPassword = bcrypt.hashSync(password, 7);
            const newUser = await db.query('INSERT INTO users (first_name, last_name, username, email, password) values ($1, $2, $3, $4, $5) RETURNING *', [first_name, last_name, username, email, hashPassword]);
            return res.json(newUser.rows[0]);
        } catch (e) {
            return res.status(400).json({ message: "Произошла ошибка при создании пользователя", error: e.message });
        }
    }

    async login(req, res) {
        try {
            const {
                username,
                password
            } = req.body;
            console.log(username)
            const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
            if (result.rows.length == 0) {
                return res.status(400).json({ message: "Пользователь с таким Никнеймом не найден" });
            }

            const user = result.rows[0];
            const validPassword = bcrypt.compareSync(password, user.password);

            if (!validPassword) {
                return res.status(400).json({ message: "Введен неверный пароль" });
            }

            const token = generateAccessToken(user.id, username);

            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                domain: 'sotialnetworkbackend.onrender.com',
                path: '/',         
                sameSite: 'none'   
            });
            return res.json({ token });
        } catch (e) {
            return res.status(400).json({ message: "Произошла ошибка авторизации пользователя", error: e.message });
        }
    }

    async logout(req, res) {
        try {
            res.cookie('token', '', { httpOnly: true, secure: true, expires: new Date(0) });

            return res.json({ message: "Вы успешно вышли из системы" });
        } catch (e) {
            return res.status(500).json({ message: "Ошибка при выходе из системы", error: e.message });
        }
    }

    async refresh(req, res) {
        try {
            const { id, username } = req.user;
            res.status(200).json({ id: id, user: username });
        } catch (e) {
            return res.status(400).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }

    async createPost(req, res) {
        try {
            const files = req.files;
            const {
                content,
            } = req.body;
            const { id } = req.user;

            let result;

            if (files.length) {
                const urls = [];

                for (const file of files) {
                    const filename = new Date().getTime();
                    const imageRef = ref(auth, 'posts/' + filename);
                    const snapshot = await uploadBytes(imageRef, file.buffer);
                    const imageURL = await getDownloadURL(snapshot.ref);
                    urls.push(imageURL);
                }

                result = await db.query('INSERT INTO posts (user_id, content, media_content) values ($1, $2, $3) RETURNING *', [id, content, urls]);

            } else {
                result = await db.query('INSERT INTO posts (user_id, content) values ($1, $2) RETURNING *', [id, content]);
            }


            if (!result.rows.length) {
                return res.status(400).json({ message: "Ошибка записи данных" });
            }
            return res.json(result.rows);
        } catch (e) {
            return res.status(400).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }

    async getAllPosts(req, res) {
        try {
            const { id } = req.user;

            const result = await db.query(`
                SELECT 
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
            `, [id]);

            res.json(result.rows);
        } catch (e) {
            return res.status(400).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }

    async likes(req, res) {
        const { post_id } = req.body;
        const { id: user_id } = req.user;

        try {
            const result = await db.query('SELECT * FROM likes WHERE user_id = $1 AND post_id = $2', [user_id, post_id]);

            if (result.rows.length > 0) {
                await db.query('DELETE FROM likes WHERE user_id = $1 AND post_id = $2', [user_id, post_id]);
                await db.query('UPDATE posts SET likes_count = likes_count - 1 WHERE id = $1', [post_id]);
                return res.json({ message: 'Лайк удален', is_liked: false, post_id });
            } else {
                await db.query('INSERT INTO likes (user_id, post_id) VALUES ($1, $2)', [user_id, post_id]);
                await db.query('UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1', [post_id]);
                return res.json({ message: 'Пост лайкнут', is_liked: true, post_id });
            }
        } catch (e) {
            return res.status(500).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }

    async getUser(req, res) {
        try {
            const { id } = req.user;
            const usernameParam = req.params.username;
            console.log(usernameParam, id);

            let username;

            if (id == usernameParam) {
                const res = await db.query('SELECT username FROM users WHERE id = $1', [id]);
                username = res.rows[0].username;
            } else {
                username = usernameParam;
            }

            console.log(username);

            const result = await db.query(`
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
            `, [id, username]);

            if (!result.rows.length) {
                return res.status(400).json({ message: "Ошибка запроса к БД" });
            }

            const userInfo = result.rows[0];

            const posts = await db.query('SELECT * FROM posts WHERE user_id = $1', [userInfo.id]);
            userInfo.posts = posts.rows;

            return res.json(userInfo);
        } catch (e) {
            return res.status(500).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }

    async follow(req, res) {
        try {
            const { id: followerId } = req.user;
            const { followedId } = req.body;
            console.log('f', followedId)
            const existingFollow = await db.query('SELECT * FROM followers WHERE follower_id = $1 AND followee_id = $2', [followerId, followedId]);

            if (existingFollow.rowCount > 0) {
                await db.query('DELETE FROM followers WHERE follower_id = $1 AND followee_id = $2', [followerId, followedId]);
                return res.json({ followed: false });
            } else {
                await db.query('INSERT INTO followers (follower_id, followee_id) VALUES ($1, $2)', [followerId, followedId]);
                return res.json({ followed: true });
            }
        } catch (e) {
            return res.status(500).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }

    async search(req, res) {
        try {
            let searchText = "%" + req.params.searchText + "%";

            const result = await db.query(
                `SELECT id, first_name, last_name, username, avatar 
                 FROM users 
                 WHERE username like $1`, [searchText]);

            return res.json(result.rows);
        } catch (e) {
            return res.status(500).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }

    async setAvatar(req, res) {
        try {
            const file = req.file;
            const { id } = req.user;

            const filename = new Date().getTime() + '_' + file.filename;
            const imageRef = ref(auth, 'avatar/' + filename);
            const snapshot = await uploadBytes(imageRef, file.buffer);
            const imageURL = await getDownloadURL(snapshot.ref);

            await db.query('UPDATE users SET avatar = $2 WHERE id = $1 ', [id, imageURL]);

            return res.json({ image: imageURL });
        } catch (e) {
            return res.status(500).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }

    async setBackground(req, res) {
        try {
            const file = req.file;
            const { id } = req.user;

            const filename = new Date().getTime() + '_' + file.filename;
            const imageRef = ref(auth, 'background/' + filename);
            const snapshot = await uploadBytes(imageRef, file.buffer);
            const imageURL = await getDownloadURL(snapshot.ref);

            await db.query('UPDATE users SET background_image = $2 WHERE id = $1 ', [id, imageURL]);

            return res.json({ image: imageURL });
        } catch (e) {
            return res.status(500).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }

    async setDescriptionProfile(req, res) {
        try {
            const { id } = req.user;
            const { description } = req.body;

            await db.query('UPDATE users SET description = $2 WHERE id = $1 ', [id, description]);

            return res.json({ description: description });
        } catch (e) {
            return res.status(500).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }

    async newSupportMessage(req, res) {
        try {
            const { id } = req.user;
            const { message } = req.body;

            const result = await db.query('INSERT INTO support (user_id, description) values ($1, $2) RETURNING *', [id, message]);

            if (!result.rows.length) {
                return res.status(400).json({ message: "Ошибка запроса к БД" });
            }
            return res.json();
        } catch (e) {
            return res.status(500).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }

    async getFavoritesPosts(req, res) {
        try {
            const { id } = req.user;

            const result = await db.query(`
                SELECT p.*,                     
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
            `, [id]);

            return res.json(result.rows);
        }
        catch (e) {
            return res.status(500).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }

    async getFollowers(req, res) {
        try {
            const user_id = req.params.user_id;

            const result = await db.query(`
                SELECT u.username, 
                    u.avatar,
                    u.first_name,
                    u.last_name,
                    u.id
                FROM followers f
                JOIN users u ON u.id = f.follower_id
                WHERE followee_id = $1
            `, [user_id]);

            res.json(result.rows);
        }
        catch (e) {
            return res.status(500).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }

    async getFollowing(req, res) {
        try {
            const user_id = req.params.user_id;

            const result = await db.query(`
                SELECT u.username, 
                    u.avatar,
                    u.first_name,
                    u.last_name,
                    u.id
                FROM followers f
                JOIN users u ON u.id = f.followee_id
                WHERE follower_id = $1
            `, [user_id]);

            res.json(result.rows);

        }
        catch (e) {
            return res.status(500).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }
}

module.exports = new UserController();
