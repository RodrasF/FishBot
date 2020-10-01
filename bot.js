const tmi = require('tmi.js');
const tps = require('twitchps');

module.exports = function (accessToken, channel) {
  // Define TMI configuration options
  const opts = {
    options: {
      debug: true
    },
    connection: {
      secure: true,
      reconnect: true
    },
    identity: {
      username: process.env.BOT_USERNAME,
      password: process.env.BOT_OAUTH_TOKEN
    },
    channels: [
      channel.login
    ]
  };

  // Create a TMI client with our options
  const client = new tmi.client(opts);

  // Register our TMI event handlers (defined below)
  client.on('message', onMessageHandler);
  client.on('connected', onConnectedHandler);

  // Initialize topics for PubSub
  const init_topics = [{
    topic: `channel-points-channel-v1.${channel.id}`,
    token: accessToken,
  }];

  // Create a PubSub client with our options
  const pubSub = new tps({
    init_topics,
    reconnect: true,
    debug: true,
  });

  // Register our event handlers for PubSub
  pubSub.on('channel-points', onRewardHandler);

  // Connect to Twitch:
  client.connect();

  // Called every time a message comes in
  function onMessageHandler (target, context, msg, self) {
    if (self) { return; } // Ignore messages from the bot

    // Remove whitespace from chat message
    const commandName = msg.trim();

    // If the command is known, let's execute it
    if (commandName) {
      console.log(`* Executed ${commandName} command`);
    } else {
      console.log(`* Unknown command ${commandName}`);
    }
  }

  // Called every time the bot connects to Twitch chat
  function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
  }

  async function onRewardHandler (data) {
    try {
      const { redemption } = data;
      
    } catch (error) {
      console.log('* Error handling reward redemption', data, error);
    }
  }
}