require('dotenv').config()
console.log(process.env) // remove this after you've confirmed it working

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
bot.message("hello", async ({ command, say }) => { // Replace hello with the message
    try {
        say("Hi! Thanks for PM'ing me!");
    } catch (error) {
        console.log("err")
      console.error(error);
    }
});

const welcomeChannelId = 'C03GGMNC80M';

// When a user joins the team, send a message in a predefined channel asking them to introduce themselves
bot.event('message', async ({ event, client, logger }) => {
  try {
    // Call chat.postMessage with the built-in client
    const result = await client.chat.postMessage({
      channel: welcomeChannelId,
      text: `Welcome to the team, <@${event.user.id}>! 🎉 You can introduce yourself in this channel.`
    });
    logger.info(result);
  }
  catch (error) {
    logger.error(error);
  }
});

(async () => {
  // Start your app
  await bot.start();

  console.log('⚡️ Bolt app is running!');
})();