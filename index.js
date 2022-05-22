const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


//Get Data
app.get('/', (req, res) => {
    res.send('Hello From tools mania')
})

app.listen(port, () => {
    console.log(`tools mania app listening on port ${port}`)
})