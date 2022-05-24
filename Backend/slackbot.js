const { App } = require("@slack/bolt");

const bot = new App({
    token: "xoxb-3563554157315-3563621120514-GDzDn2MgCuxHcqSmsWAWQ2xd", //Find in the Oauth  & Permissions tab
    signingSecret: "4e2f8ba0d6210e7d6d0bb21d645a8bbc", // Find in Basic Information Tab
    socketMode:true,
    appToken: "xapp-1-A03H9AHV264-3561701120213-1e5dd88df5427098aa111e6a08ecc725af92107e0a3f72cc7047eba20ad4d06f" // Token from the App-level Token that we created
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


bot.start(6000)