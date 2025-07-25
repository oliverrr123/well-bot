# Slack Bot - AI Chatbot with AWS Bedrock

A Slack bot that uses AWS Bedrock (Claude 3 Sonnet) to provide intelligent responses to direct messages.

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

5. **Enable Event Subscriptions:**
   - Go to "Event Subscriptions" in the sidebar
   - Toggle "Enable Events" to ON
   - Under "Subscribe to bot events" add:
     - `message.im` (for direct messages)
     - `app_mention` (for mentions)
   - Click "Save Changes"

6. **Set up AWS Bedrock:**
   - Create an AWS account if you don't have one
   - Go to AWS IAM Console and create a user with Bedrock permissions
   - Generate Access Key and Secret Access Key
   - Enable Bedrock service in your AWS region

7. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   Then edit `.env` with your actual values:
   ```
   SLACK_BOT_TOKEN=xoxb-your-bot-token-here
   SLACK_SIGNING_SECRET=your-signing-secret-here
   SLACK_APP_TOKEN=xapp-your-app-token-here
   TARGET_USER_ID=U1234567890
   AWS_ACCESS_KEY_ID=your-aws-access-key-id
   AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
   AWS_REGION=us-east-1
   ```

8. **Get your user ID:**
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
2. The bot will respond with AI-generated responses using AWS Bedrock (Claude 3 Sonnet)

## Features

- ✅ **AI-powered responses** using AWS Bedrock Claude 3 Sonnet
- ✅ **Direct message support** - responds to DMs
- ✅ **Mention support** - responds when mentioned in channels
- ✅ **Single user targeting** - only responds to specified user
- ✅ **Error handling** - graceful error responses
- ✅ **Socket Mode** - no public hosting required

## AWS Bedrock Setup

1. **Create AWS Account:**
   - Sign up at [aws.amazon.com](https://aws.amazon.com)

2. **Create IAM User:**
   - Go to IAM Console
   - Create a new user
   - Attach the `AmazonBedrockFullAccess` policy
   - Generate Access Key and Secret Access Key

3. **Enable Bedrock:**
   - Go to AWS Bedrock Console
   - Enable the service in your chosen region
   - Request access to Claude 3 Sonnet model

4. **Add credentials to .env:**
   ```
   AWS_ACCESS_KEY_ID=AKIA...
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_REGION=us-east-1
   ```

## Testing with curl

You can also test sending messages using curl:

```bash
curl -X POST https://slack.com/api/chat.postMessage \
-H 'Content-type: application/json' \
-H 'Authorization: Bearer YOUR_BOT_TOKEN' \
-d '{"channel": "USER_ID","text": "Hello world :tada:"}'
```

Replace `YOUR_BOT_TOKEN` with your actual bot token and `USER_ID` with the target user ID. 