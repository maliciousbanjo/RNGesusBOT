const utils = require('./helpers/utils.js');
const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.json');

// TODO: Remove old database code
//const dbUtils = require('./helpers/databaseUtils');

// Connect to the database
//dbUtils.connect();

// CLIENT SETUP
const myIntents = new Discord.Intents();
myIntents.add('GUILD_MEMBERS', Discord.Intents.NON_PRIVILEGED);

const client = new Discord.Client({
  ws: { intents: myIntents },
  fetchAllMembers: true,
  precense: { status: 'invisible' },
});

// Load events
try {
  const events = fs.readdirSync('./events');
  for (const file of events) {
    const event = require(`./events/${file}`);
    const eventName = file.split('.')[0];
    client.on(eventName, event.bind(null, client));
  }
} catch (err) {
  console.error(err);
}

// Load commands
client.commands = new Discord.Collection();
client.commandCategories = fs.readdirSync('./commands');
try {
  //const commandFolders = fs.readdirSync('./commands');
  for (const folder of client.commandCategories) {
    const commandFiles = fs
      .readdirSync(`./commands/${folder}`)
      .filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
      const command = require(`./commands/${folder}/${file}`);
      console.log(`Loading command ${command.name}`);
      client.commands.set(command.name, command);
    }
  }
} catch (err) {
  console.error(err);
}

// Event Handlers
client.once('ready', () => {
  console.log('Logged in as ' + client.user.tag);
  if (!utils.validateConfig(client)) {
    process.exit(1);
  }
  client.user.setPresence({
    status: 'online',
    activity: { name: 'God | !help' },
  });

  // Scan and add new users, emoji to the MySQL database
  utils.scanUsers(client, config.serverId);
  utils.scanEmoji(client, config.serverId);
});

client.on('error', (error) => {
  console.error(error.message);
});

client.on('disconnect', (thing) => {
  console.log("I'm disconnecting now");
  console.log(thing);
});

// LOGIN
client.login(config.token);
