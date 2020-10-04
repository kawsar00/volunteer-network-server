const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ggbl3.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(cors())
app.use(bodyParser.json())

// console.log(process.env.DB_USER, process.env.DB_PASS, process.env.DB_NAME);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

  const volunteerCollection = client.db("volunteerStore").collection("volunteerData");
  const registerDataCollection = client.db("registerDataStore").collection("registerData");

  console.log('database connected');

  app.post('/addData', (req, res) => {
    const volunteeringData = req.body
    console.log(volunteeringData);
    console.log(volunteeringData)
    volunteerCollection.insertMany(volunteeringData)
    .then(result => {
      res.send(result)
    })
  })

  //read all products from server
  app.get('/data', (req, res) => {
    volunteerCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  //add registerData form customer
  app.post('/registerData', (req, res) => {
    const register = req.body 
    registerDataCollection.insertOne(register) 
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })


  // app.post('/addUserData', (req, res) => {
  //   const userData = req.body
  //   console.log(userData)
  //   volunteerCollection.insertOne(userData)
  //   .then(result => {
  //     res.send(result.insertedCount > 0)
  //     console.log(result);
  //   })
  // })

});



app.get('/', (req, res) => {
  res.send('Hello World!')
})


const port = 5000
app.listen(port)