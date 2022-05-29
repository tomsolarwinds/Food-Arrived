require('dotenv').config()
const axios = require('axios')

const { App } = require("@slack/bolt");

const bot = new App({
    token: process.env.OAUTH_TOKEN, //Find in the Oauth  & Permissions tab
    signingSecret: process.env.SIGNING_SECRET, // Find in Basic Information Tab
    appToken: process.env.APP_TOKEN, // Token from the App-level Token that we created
    port: process.env.PORT || 3000,
    socketMode: true
});

bot.command("/square", async ({ command, ack, say }) => {
    try {
      await ack();
      let txt = command.text // The inputted parameters
      if(isNaN(txt)) {
          say(txt + " is not a number")
      } else {
          say(txt + " squared = " + (parseFloat(txt) * parseFloat(txt)))
      }
    } catch (error) {
      console.log("err")
      console.error(error);
    }
});

bot.message(':wave:', async ({ message, say }) => {
  await say(`שלום, <@${message.user}>, אנא כתוב את השם המלא שלך כמו שמופיע בסיבוס עם המילה רישום בסוף!`);
  await say('למשל: ישראל ישראלי רישום')
});

bot.message('רישום', async ({ message, say }) => {
  const slackID = message['user']
  const text = message['text']
  const {user: {name, profile:{image_512:imgUrl}}} = await bot.client.users.info({user: user_id})
  const email = name.concat('@solarwinds.com')
  const text_array = text.trim().split(/\s+/).filter(m => m.trim() && m !==  'רישום')
  const firstName = text_array[0]
  const lastName = text_array.slice(1).join(' ')
  const response = await axios.post(
     'http://ec2-18-192-191-34.eu-central-1.compute.amazonaws.com:3000/user', {email, firstName, lastName, imgUrl, slackID})
  if(response.status === 200)
    await say(`.הרישום בוצע. תודה.`);
  else  await say('קרתה תקלה, הרישום לא נשמר :(')
});

(async () => {
  // Start your app
  await bot.start();

  console.log('⚡️ Bolt app is running!');
})();