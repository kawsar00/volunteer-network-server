const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectId
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ggbl3.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(cors())
app.use(bodyParser.json())


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

  const volunteerCollection = client.db("volunteerStore").collection("volunteerData");
  const registerDataCollection = client.db("registerDataStore").collection("registerData");

  //add all volunteer data
  app.post('/addData', (req, res) => {
    const volunteeringData = req.body
    console.log(volunteeringData);
    console.log(volunteeringData)
    volunteerCollection.insertMany(volunteeringData)
    .then(result => {
      res.send(result)
    })
  })

  //read all volunteer data from server
  app.get('/data', (req, res) => {
    volunteerCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  //add registerData form user
  app.post('/addRegisterData', (req, res) => {
    const register = req.body 
    registerDataCollection.insertOne(register) 
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  //read user registerData  
  app.get('/registerData', (req, res) => {
    registerDataCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  //delete data form server
  app.delete(`/delete/:id`, (req, res) => {
    console.log(req.params.id)
  
    registerDataCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then(result =>{
      // console.log(result)
      res.send(result.deletedCount > 0)
    })
  
  })

  
});

app.get('/', (req, res) => {
  res.send('Hello its working!')
})


const port = 5000
app.listen(process.env.PORT || port)