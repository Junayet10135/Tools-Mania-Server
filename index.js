const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectID } = require('bson');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//MongoDB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h8kud.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//JWT Verify

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'UnAuthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }
        req.decoded = decoded;
        next();
    });
}

async function run (){
    try{

        await client.connect();
        const toolsCollection = client.db("tools_mania").collection("tools");
        const userCollection = client.db("tools_mania").collection("users");
        const orderCollection = client.db("tools_mania").collection("orders");

        //Tools
        app.get('/tools', async (req, res) => {
            const query = {};
            const cursor = toolsCollection.find(query);
            const tools = await cursor.toArray();
            res.send(tools);
        });

        app.get('/tools/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) };
            const tools = await toolsCollection.findOne(query);
            res.send(tools);
        });

        app.patch('/tools/:id',  async (req, res) => {
            const id = req.params.id;
            const quantity = req.body;
            const filter = { _id: ObjectID(id) };
            const updatedDoc = {
                $set: {
                    availableQuantity: quantity.restAvailableQuantity
                }
            }
            const updatedBooking = await toolsCollection.updateOne(filter, updatedDoc);
            res.send(updatedBooking);
        })

        //Users

        app.get('/user', async (req, res) => {
            const users = await userCollection.find().toArray();
            res.send(users);
        });

        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send({ result, token });
        });

        //Orders

        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });

        app.get('/order', async (req, res) => {
            const orders = await orderCollection.find().toArray();
            res.send(orders);
        });
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