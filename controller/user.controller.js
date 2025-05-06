const db = require('../db');
const {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} = require('firebase/storage');
const { auth } = require('../firebase.config');
const userService = require('../services/user.service');
const postService = require('../services/post.service');

class UserController {
    async getUser(req, res) {
        try {
            const { id } = req.user;
            const usernameParam = req.params.username;

            let username;

            if (id == usernameParam) {
                const res = await userService.getUsernameById(id);
                username = res.rows[0].username;
            } else {
                username = usernameParam;
            }

            const result = await userService.getFullInfo(id, username);

            if (!result.rows.length) {
                return res.status(400).json({ message: "Ошибка запроса к БД" });
            }

            const userInfo = result.rows[0];

            const posts = await postService.getByUser(userInfo.id);
            userInfo.posts = posts.rows;

            return res.json(userInfo);
        } catch (e) {
            return res.status(500).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }

    async setAvatar(req, res) {
        try {
            const file = req.file;
            const { id } = req.user;

            const userResult = await userService.getAvater(id);
            const oldAvatarURL = userResult.rows[0]?.avatar;

            const extractPathFromURL = (url) => {
                const pathStart = url.indexOf('/o/') + 3;
                const pathEnd = url.indexOf('?');
                return decodeURIComponent(url.slice(pathStart, pathEnd));
            };

            if (oldAvatarURL) {
                try {
                    const oldAvatarPath = extractPathFromURL(oldAvatarURL);
                    const oldFileRef = ref(auth, oldAvatarPath);
                    await deleteObject(oldFileRef);
                } catch (deleteError) {
                    console.error('Ошибка при удалении старой аватарки:', deleteError.message);
                }
            }

            const filename = new Date().getTime();
            const imageRef = ref(auth, 'avatar/' + filename);
            const snapshot = await uploadBytes(imageRef, file.buffer);
            const imageURL = await getDownloadURL(snapshot.ref);

            await userService.updateAvatar(id, imageURL);

            return res.json({ image: imageURL });
        } catch (e) {
            return res.status(500).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }

    async setBackground(req, res) {
        try {
            const file = req.file;
            const { id } = req.user;

            const userResult = await userService.getBackground(id);
            const oldAvatarURL = userResult.rows[0]?.background_image;

            const extractPathFromURL = (url) => {
                const pathStart = url.indexOf('/o/') + 3;
                const pathEnd = url.indexOf('?');
                return decodeURIComponent(url.slice(pathStart, pathEnd));
            };

            if (oldAvatarURL) {
                try {
                    const oldAvatarPath = extractPathFromURL(oldAvatarURL);
                    const oldFileRef = ref(auth, oldAvatarPath);
                    await deleteObject(oldFileRef);
                } catch (deleteError) {
                    console.error('Ошибка при удалении старой аватарки:', deleteError.message);
                }
            }

            const filename = new Date().getTime() + '_' + file.filename;
            const imageRef = ref(auth, 'background/' + filename);
            const snapshot = await uploadBytes(imageRef, file.buffer);
            const imageURL = await getDownloadURL(snapshot.ref);

            await userService.updateBackground(id, imageURL);

            return res.json({ image: imageURL });
        } catch (e) {
            return res.status(500).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }

    async setDescriptionProfile(req, res) {
        try {
            const { id } = req.user;
            const { description } = req.body;

            await userService.updateDescription(id, description);
            return res.json({ description: description });
        } catch (e) {
            return res.status(500).json({ message: "Произошла непредвиденная ошибка", error: e.message });
        }
    }
}

module.exports = new UserController();
