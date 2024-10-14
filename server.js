const express = require("express");
const app = express();

const cors = require('cors');

app.use(express.json());
app.use(cors());

const userRouter = require('./routes/user.routes');
app.use('/api', userRouter);

app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001");
});