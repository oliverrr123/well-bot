# Slack Bot - Simple DM Chatbot

A simple Slack bot that responds with "pong" when you send it a direct message.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create a Slack App:**
   - Go to [api.slack.com/apps](https://api.slack.com/apps)
   - Click "Create New App" → "From scratch"
   - Give it a name and select your workspace

3. **Configure your Slack App:**
   - Go to "OAuth & Permissions" in the sidebar
   - Add these bot token scopes:
     - `chat:write`
     - `im:read`
     - `im:write`
   - Install the app to your workspace
   - Copy the "Bot User OAuth Token" (starts with `xoxb-`)

4. **Get your app credentials:**
   - Go to "Basic Information" → "Signing Secret" (copy this)
   - Go to "Basic Information" → "App-Level Tokens" → "Generate Token and Scopes"
   - Add the `connections:write` scope and generate the token (starts with `xapp-`)

5. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   Then edit `.env` with your actual values:
   ```
   SLACK_BOT_TOKEN=xoxb-your-bot-token-here
   SLACK_SIGNING_SECRET=your-signing-secret-here
   SLACK_APP_TOKEN=xapp-your-app-token-here
   TARGET_USER_ID=U1234567890
   ```

6. **Get your user ID:**
   - In Slack, right-click your name and select "Copy link"
   - The user ID is the part after the last `/` in the URL

## Running the bot

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

## Usage

Once the bot is running:
1. Send a direct message to your bot in Slack
2. The bot will respond with "pong"

## Testing with curl

You can also test sending messages using curl (as mentioned in your requirements):

```bash
curl -X POST https://slack.com/api/chat.postMessage \
-H 'Content-type: application/json' \
-H 'Authorization: Bearer YOUR_BOT_TOKEN' \
-d '{"channel": "USER_ID","text": "Hello world :tada:"}'
```

Replace `YOUR_BOT_TOKEN` with your actual bot token and `USER_ID` with the target user ID.

## Features

- ✅ Responds with "pong" to direct messages
- ✅ Only responds to the specified target user
- ✅ Works in one server only
- ✅ Simple and lightweight for hackathon use 