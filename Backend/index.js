const express = require('express')
const AWS = require('aws-sdk')
const bodyParser = require('body-parser')
require('dotenv').config()

AWS.config.update({
     region: process.env.REGION,
})

const app = express()
const client = new AWS.DynamoDB.DocumentClient()
const tableName = 'Food-Arrived-Orders'
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000

app.post('/order/new', (req,res) => {
  console.log(req)
  var body = req.body
  var params = {
    TableName: tableName,
    Item: {
      ...body
      // creates a new uuid
      // name property passed from body
      // "firstName": body["firstName"],
      // "lastName": body["lastName"]
    }
  }

  client.put(params, (err, data) => {
    if (err) {
      console.error("Unable to add item.")
      console.error("Error JSON:", JSON.stringify(err, null, 2))
      res.send("oh oh oh oh ")
    }
    else {
      console.log("Added item:", JSON.stringify(data, null, 2))
      res.send("very succsesfully")
    }
  })
})

app.get('/orders',(req, res) => {
  var params = {
      TableName: tableName
  }

  client.scan(params, (err, data) => {
      if (err) {
          console.log(err)
      } 
      else {
          console.log(data)
          res.send(data)
      }
  })
})

app.get('/ordernumbers',(req, res) => {
  var params = {
      TableName: tableName
  }

  client.scan(params, (err, data) => {
      if (err) {
          console.log(err)
      } 
      else {
          console.log(data)
          const dataNumbers = data.map( item => item.orderNumber)
          res.send(dataNumbers)
      }
  })
})

app.listen(PORT, () => console.log(`Server listening in port ${PORT}`))
