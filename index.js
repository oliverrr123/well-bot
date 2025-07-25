const { App } = require('@slack/bolt');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
require('dotenv').config();

// Initialize AWS Bedrock client with AWS CLI credentials
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  // AWS CLI credentials will be automatically picked up
});

// Initialize the Slack app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

// Get the target user ID from environment variables
const TARGET_USER_ID = process.env.TARGET_USER_ID;

// Function to get response from AWS Bedrock
async function getBedrockResponse(userMessage) {
  try {
    console.log('🔍 DEBUG: Starting Bedrock request');
    console.log('🔍 DEBUG: User message:', userMessage);
    
    // Using Claude 3 Sonnet model
    const modelId = 'anthropic.claude-3-sonnet-20240229-v1:0';
    
    const input = {
      modelId: modelId,
      contentType: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ]
      })
    };

    console.log('🔍 DEBUG: Request input:', JSON.stringify(input, null, 2));

    const command = new InvokeModelCommand(input);
    const response = await bedrockClient.send(command);
    
    console.log('🔍 DEBUG: Response received successfully');
    
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    console.log('🔍 DEBUG: Parsed response:', JSON.stringify(responseBody, null, 2));
    
    if (responseBody.content && responseBody.content[0] && responseBody.content[0].text) {
      const aiResponse = responseBody.content[0].text;
      console.log('🔍 DEBUG: AI Response:', aiResponse);
      return aiResponse;
    }
    
    console.log('⚠️ DEBUG: Could not parse response properly');
    return 'I received your message but had trouble processing it. Can you try again?';
  } catch (error) {
    console.error('❌ Error calling Bedrock:', error);
    return 'Sorry, I encountered an error. Please try again.';
  }
}

// Listen for direct messages
app.message(async ({ message, say }) => {
  console.log('📨 DEBUG: Received message event');
  console.log('📨 DEBUG: Message user:', message.user);
  console.log('📨 DEBUG: Target user:', TARGET_USER_ID);
  console.log('📨 DEBUG: Message text:', message.text);
  console.log('📨 DEBUG: Message channel:', message.channel);
  
  // Check if the message is from the target user
  if (message.user === TARGET_USER_ID) {
    console.log('✅ DEBUG: Message is from target user, processing...');
    try {
      // Get response from AWS Bedrock
      const aiResponse = await getBedrockResponse(message.text);
      
      console.log('📤 DEBUG: Sending response to Slack:', aiResponse);
      
      // Respond with AI-generated message
      await say({
        text: aiResponse,
        channel: message.channel
      });
      
      console.log('✅ DEBUG: Response sent successfully');
    } catch (error) {
      console.error('❌ Error processing message:', error);
      await say({
        text: 'Sorry, I encountered an error. Please try again.',
        channel: message.channel
      });
    }
  } else {
    console.log('❌ DEBUG: Message is not from target user, ignoring');
  }
});

// Handle app mentions (optional - in case someone mentions the bot)
app.event('app_mention', async ({ event, say }) => {
  console.log('📨 DEBUG: Received app_mention event');
  console.log('📨 DEBUG: Event user:', event.user);
  console.log('📨 DEBUG: Event text:', event.text);
  
  // Check if the mention is from the target user
  if (event.user === TARGET_USER_ID) {
    console.log('✅ DEBUG: Mention is from target user, processing...');
    try {
      // Remove the bot mention from the message
      const userMessage = event.text.replace(/<@[^>]+>/, '').trim();
      console.log('📨 DEBUG: Cleaned user message:', userMessage);
      
      if (userMessage) {
        const aiResponse = await getBedrockResponse(userMessage);
        await say({
          text: aiResponse,
          channel: event.channel
        });
      } else {
        await say({
          text: 'Hello! How can I help you today?',
          channel: event.channel
        });
      }
    } catch (error) {
      console.error('❌ Error processing mention:', error);
      await say({
        text: 'Sorry, I encountered an error. Please try again.',
        channel: event.channel
      });
    }
  } else {
    console.log('❌ DEBUG: Mention is not from target user, ignoring');
  }
});

// Start the app
(async () => {
  await app.start();
  console.log('⚡️ Slack bot is running!');
  console.log(`Target user ID: ${TARGET_USER_ID}`);
  console.log('🤖 AWS Bedrock integration enabled');
  console.log('🔍 DEBUG: Environment variables check:');
  console.log('🔍 DEBUG: - SLACK_BOT_TOKEN exists:', !!process.env.SLACK_BOT_TOKEN);
  console.log('🔍 DEBUG: - SLACK_SIGNING_SECRET exists:', !!process.env.SLACK_SIGNING_SECRET);
  console.log('🔍 DEBUG: - SLACK_APP_TOKEN exists:', !!process.env.SLACK_APP_TOKEN);
  console.log('🔍 DEBUG: - AWS_REGION:', process.env.AWS_REGION);
  console.log('🔍 DEBUG: - Using AWS CLI credentials');
})(); 