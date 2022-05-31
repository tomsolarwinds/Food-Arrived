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

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

const getTime = (arrivalTime) => {
  const time = arrivalTime.split(':');
  console.log('Time:', new Date(null, null, null,parseInt (time[0] || 0), parseInt(time[1] || 0)))
  return new Date(null, null, null,parseInt (time[0] || 0), parseInt(time[1] || 0))
}

app.post('/orders/new', (req,res, next) => {
  var newOrders = req.body
  var params = {
    TableName: tableName
  }

client.scan(params, (err, data) => {
  if (err) {
    console.log('Error', err)
    res.send(err)
  }
  else {
    newOrders.forEach(newOrder => {
      const orderToUpdate = data.Items.find(order => order.firstName === newOrder.firstName && order.lastName === newOrder.lastName)
      if (orderToUpdate) {
        var params = {
          TableName: tableName,
          Key: { email: orderToUpdate.email },
          UpdateExpression: 'set #a = :t, #b = :b, #r = :r, #i = :i',
          ExpressionAttributeNames: { '#a' : 'isArrived', '#b' : 'orderNumber', '#r' : 'restaurant', '#i' : 'deliveryTime' },
          ExpressionAttributeValues: { ":t": false, ':b': newOrder.orderNumber, ':r': newOrder.restaurant, ':i': getTime(newOrder.deliveryTime) }
        }
      
        client.update(params, async (err, data) => {
          if (err) {
            console.error(err)
            console.error("Error JSON:", JSON.stringify(err, null, 2))
            res.send(err)
          }
          else {
            console.log(data)
            res.send("Successfully updated")
          }
        })
      }
    });
  }
})
})

app.get('/orders',(req, res, next) => {
  var params = {
      TableName: tableName
  }

  client.scan(params, (err, data) => {
    if (err) {
      console.log(err)
      res.send(err)
    } 
    else {
      console.log(data.Items.filter(order => order.orderNumber && order.isArrived === false))
      res.send(data.Items.filter(order => order.orderNumber && order.isArrived === false))
    }
  })
})

app.get('/ordernumbers',(req, res, next) => {
  var params = {
    TableName: tableName,
    ProjectionExpression: 'orderNumber'
  }

  client.scan(params, (err, data) => {
    if (err) {
      console.log(err)
      res.send(err)
    } 
    else {
      console.log(data)
      res.send(data)
    }
  })
})

app.put('/order/:email', (req, res, next) => { // is Arrived
  var params = {
    TableName: tableName,
    Key: { email: req.params.email },
    UpdateExpression: 'set #a = :t',
    ExpressionAttributeNames: { '#a' : 'isArrived' },
    ExpressionAttributeValues: { ":t": true },
    ReturnValues: "ALL_NEW"
  }

  client.update(params, async (err, data) => {
    if (err) {
      console.error(err)
      console.error("Error JSON:", JSON.stringify(err, null, 2))
      res.send(err)
    }
    else {
      console.log(data)
      const channelId = data.Attributes.slackID
      try {
        const result = await bot.chat.postMessage({
          channel: channelId,
          text: "Food has arrived, come to eat :knife_fork_plate:"
        });

        console.log(result);
      }
      catch (error) {
        console.log('IN /order/:email', error)
        res.status(400)
        res.send(error)
      }
      res.send("Successfully")
    }
  })
})

app.post('/user', (req, res, next) => {
  console.log(req)
  var body = req.body
  var params = {
    TableName: tableName,
    Item: { ...body }
  }

  client.put(params, (err, data) => {
    if (err) {
      console.log('IN /user', err)
      res.status(400)
      res.send(err)
    }
    else {
      console.log('IN /user', 'Successfully')
      res.send("Successfully added")
    }
  })
})

app.get('/users',(req, res, next) => {
  var params = {
    TableName: tableName
}

client.scan(params, (err, data) => {
  if (err) {
    console.log('IN /users', err)
    res.send(err)
  } 
  else {
    console.log('IN /users', 'Successfully')
    res.send(data.Items)
  }
  })
})


app.put('/setArrived', (req, res, next) => {
  var params = {
    TableName: tableName
  }

  client.scan(params, (err, data) => {
    if (err) {
      console.log('Error', err)
      res.send(err)
    }
    else {
      data.Items.forEach(order => {
        var params = {
          TableName: tableName,
          Key: { email: order.email },
          UpdateExpression: 'set #a = :t, #b = :b, #r = :r, #i = :i',
          ExpressionAttributeNames: { '#a' : 'isArrived', '#b' : 'orderNumber', '#r' : 'restaurant', '#i' : 'deliveryTime'},
          ExpressionAttributeValues: { ":t": false, ":b": null, ":r": null, ":i": null }
        }
      
        client.update(params, (err, data) => {
          if (err) {
            console.error(err)
            console.error("Error JSON:", JSON.stringify(err, null, 2))
          }
          else {
            console.log(data)
          }
        })
      });
    }
  })
})


app.listen(PORT, () => console.log(`Server listening in port ${PORT}`))
