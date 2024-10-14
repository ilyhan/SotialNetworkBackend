const express = require("express");
const app = express();

const cors = require('cors');

app.use(express.json());
app.use(cors());

app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001");
});