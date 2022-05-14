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

async function run() {
    try {
        await client.connect();
        const servicesCollection = client.db('doctors_portal').collection('services');
        const bookingCollection = client.db('doctors_portal').collection('bookings');

        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })


    /**
        * API Naming Convention
        * app.get('/booking') // get all bookings in this collection. or get more than one or by filter
        * app.get('/booking/:id') // get a specific booking 
        * app.post('/booking') // add a new booking
        * app.patch('/booking/:id) //
        * app.delete('/booking/:id) //
    */

        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const query = {treatment: booking.treatment, date: booking.date, patient: booking.patient};
            const exists = await bookingCollection.findOne(query);

            if(exists){
                return res.send({seccess: false, booking: exists});
            }

            const bookings = await bookingCollection.insertOne(booking);
            return res.send({success:true, bookings});
        })

        app.get('/booking', async (req, res) => {
            const query = {};
            const cursor = bookingCollection.find(query);
            const bookings = await cursor.toArray();
            res.send(bookings);
        })

        console.log('connected to db');
    }

    finally {

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Running doctors portal server')
})

app.listen(port, () => {
    console.log('Doctors app listening on port', port);
})