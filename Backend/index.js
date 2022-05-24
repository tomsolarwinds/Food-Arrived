const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
require('dotenv').config();

AWS.config.update({ region: 'eu-central-1' });

const app = express();
const client = new AWS.DynamoDB.DocumentClient();
const tableName = 'orders';
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

const data = [
  { email: 'maor.ovadia@solarwinds.com', name: 'maor', last_name: 'ovadia', restorant: 'pilpel'},
  { email: 'maor.ovadia@solarwinds.com', name: 'maor', last_name: 'ovadia', restorant: 'pilpel'},
  { email: 'maor.ovadia@solarwinds.com', name: 'maor', last_name: 'ovadia', restorant: 'pilpel'}
]

app.get('/',(req, res) => res.send('Hello World'));

app.post('/order/new', (req,res) => {
    var body = req.body;
    var params = {
        TableName: tableName,
        Item: {
            // creates a new uuid
            "email": body["email"],
            // name property passed from body
            "Name": body["name"]
        }};

    client.put(params, (err, data) => {
        if (err) {
            console.error("Unable to add item.");
            console.error("Error JSON:", JSON.stringify(err, null, 2));
            res.send("oh oh oh oh ")
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
            res.send("very succsesfully")
        }
    });

})

app.get('/users',(req, res) => {
    // res.send(bot.users.list())
    res.send(JSON.stringify(data))
})

app.listen(PORT, () => console.log(`Server listening in port ${PORT}`))
