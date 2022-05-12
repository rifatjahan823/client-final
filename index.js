const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hnowq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const servicesCollection = client.db('doctors_portal').collection('services');

        app.get('/service', async (req, res)=>{
            const query = {};
            const  cursor= servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        console.log('connected to db');
    }
    finally{

    }
}
run().catch(console.dir)

app.get('/', (req, res)=>{
    res.send('Running doctors portal server')
})

app.listen(port, ()=>{
    console.log('Doctors app listening on port', port);
})