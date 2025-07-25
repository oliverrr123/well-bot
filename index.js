const { App } = require('@slack/bolt');
require('dotenv').config();

// Initialize the Slack app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

// Get the target user ID from environment variables
const TARGET_USER_ID = process.env.TARGET_USER_ID;

// Listen for direct messages
app.message(async ({ message, say }) => {
  // Check if the message is from the target user
  if (message.user === TARGET_USER_ID) {
    // Respond with "pong"
    await say({
      text: 'pong',
      channel: message.channel
    });
  }
});

// Handle app mentions (optional - in case someone mentions the bot)
app.event('app_mention', async ({ event, say }) => {
  // Check if the mention is from the target user
  if (event.user === TARGET_USER_ID) {
    await say({
      text: 'pong',
      channel: event.channel
    });
  }
});

// Start the app
(async () => {
  await app.start();
  console.log('⚡️ Slack bot is running!');
  console.log(`Target user ID: ${TARGET_USER_ID}`);
})(); 