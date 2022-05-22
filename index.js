const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//MongoDB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h8kud.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{

        await client.connect();
        const toolsCollection = client.db("tools_mania").collection("tools");
    }

    finally{

    }
}
run().catch(console.dir);


//Get Data
app.get('/', (req, res) => {
    res.send('Hello From tools mania')
})

app.listen(port, () => {
    console.log(`tools mania app listening on port ${port}`)
})