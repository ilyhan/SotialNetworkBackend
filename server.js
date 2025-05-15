const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

const userRouter = require('./routes/user.routes');
const authRouter = require('./routes/auth.route');
const postRouter = require('./routes/post.route');
const searchRouter = require('./routes/search.route');
const socialRouter = require('./routes/social.route');
const supportRouter = require('./routes/support.route');

app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        callback(null, true);
    },
}));

// app.use(cors({
//     origin: 'https://sotialnetwork2.onrender.com', 
//     credentials: true, 
// }));

app.use(cookieParser());

app.use('/api', postRouter);
app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', searchRouter);
app.use('/api', socialRouter);
app.use('/api', supportRouter);

app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001");
});