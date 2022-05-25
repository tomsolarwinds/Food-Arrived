const express = require('express')
const AWS = require('aws-sdk')
const bodyParser = require('body-parser')
const { WebClient } = require("@slack/web-api");
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000
AWS.config.update({
  region: process.env.REGION
})
const client = new AWS.DynamoDB.DocumentClient()
const bot = new WebClient(process.env.TOKEN);
const tableName = 'Food-Arrived-Orders'

app.use(bodyParser.json())

app.post('/orders/new', (req,res) => {
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
      res.send("very successfully")
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
      res.send('Failed to get orders')
    } 
    else {
      console.log(data.Items.filter(order => order.isArrived === false))
      res.send(data.Items.filter(order => order.isArrived === false))
    }
  })
})

app.get('/ordernumbers',(req, res) => {
  var params = {
    TableName: tableName,
    ProjectionExpression: 'orderNumber'
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

app.put('/order/:email', (req, res) => { // is Arrived
  var params = {
    TableName: tableName,
    Key: { email: req.params.email },
    UpdateExpression: 'set #a = :t',
    ExpressionAttributeNames: { '#a' : 'isArrived' },
    ExpressionAttributeValues: { ":t": true }
  }

  client.update(params, async (err, data) => {
    if (err) {
      console.error("Unable to add item.")
      console.error("Error JSON:", JSON.stringify(err, null, 2))
      res.send("oh oh oh oh ")
    }
    else {
      const channelId = "U03GMTM2XQU" // TODO get this id from DB with email
      try {
        // Call the chat.postMessage method using the WebClient
        const result = await bot.chat.postMessage({
          channel: channelId,
          text: "Hello maor"
        });

        console.log(result);
      }
      catch (error) {
        console.error(error);
      }
      res.send("very successfully")
    }
  })
})

app.post('/user', (req, res) => {
  
})


app.listen(PORT, () => console.log(`Server listening in port ${PORT}`))
