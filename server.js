const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
// const {
//     ref,
//     uploadBytes,
//     getDownloadURL,
// } = require('firebase/storage');
// const multer = require('multer');
// const { auth } = require('./firebase.config');
const cors = require('cors');

app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        callback(null, true);
    },
    credentials: true
}));
app.use(cookieParser());


// const storage = multer.memoryStorage();
// const upload = multer({ storage });



// app.post('/products', upload.array('images', 10), async (req, res) => {
//     const files = req.files;

//     try {
//         const urls = [];
//         for (const file of files) {
//             const filename = new Date().getTime();
//             const imageRef = ref(auth, 'products/' + filename);
//             const snapshot = await uploadBytes(imageRef, file.buffer);
//             const imageURL = await getDownloadURL(snapshot.ref);
//             urls.push(imageURL);
//         }
//         return res.status(200).json(urls);
//     } catch (error) {
//         return res.status(500).json({ error: error })
//     }
// });

const userRouter = require('./routes/user.routes');
app.use('/api', userRouter);

app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001");
});