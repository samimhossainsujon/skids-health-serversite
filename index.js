const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());
const { ObjectId } = require('mongodb');


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DV_USER}:${process.env.DV_PASS}@cluster0.f7u6kbd.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // await client.connect(); 

        const usersCollection = client.db('skids-health').collection('User');

        app.post('/newUser', async (req, res) => {
            const NewUser = req.body;
            const result = await usersCollection.insertOne(NewUser);
            res.send(result);
        });

        app.get('/Users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        });




        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;                     
            const query = { _id: new ObjectId(id) }
            const result = await usersCollection.findOne(query)           
            res.send(result);

        });



        app.put('/updateUser/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const UpdatedData = req.body;
            const update = {
                $set: {

                    email: UpdatedData.email,
                    name: UpdatedData.name,
                    phoneNumber: UpdatedData.phoneNumber,

                }
            }
            const result = await usersCollection.updateOne(filter, update, options);
            res.send(result);
        });





        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        });



        await client.db('admin').command({ ping: 1 });
        // console.log('Pinged your deployment. You successfully connected to MongoDB!');
    } catch (error) {
        // console.error(error);
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
