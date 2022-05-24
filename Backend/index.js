const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const { App } = require("@slack/bolt");

AWS.config.update({ region: 'eu-central-1' });

const app = express();
const client = new AWS.DynamoDB.DocumentClient();
const tableName = 'orders';
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const token = "xoxb-3563554157315-3563621120514-GDzDn2MgCuxHcqSmsWAWQ2xd"
const bot = new App({
    token: "xoxb-3563554157315-3563621120514-GDzDn2MgCuxHcqSmsWAWQ2xd", //Find in the Oauth  & Permissions tab
    signingSecret: "4e2f8ba0d6210e7d6d0bb21d645a8bbc", // Find in Basic Information Tab
    socketMode:true,
    appToken: "xapp-1-A03H9AHV264-3561701120213-1e5dd88df5427098aa111e6a08ecc725af92107e0a3f72cc7047eba20ad4d06f" // Token from the App-level Token that we created
});

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
