const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(express.json());
// app.use(cors({
//     origin: (origin, callback) => {
//         if (!origin) return callback(null, true);
//         callback(null, true);
//     },
//     credentials: true
// }));
app.use(cors({
    origin: 'https://sotialnetwork2.onrender.com/', // Укажите домен фронтенда
    credentials: true, // Разрешить передачу кук
}));

app.use(cookieParser());

const userRouter = require('./routes/user.routes');
app.use('/api', userRouter);

app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001");
});