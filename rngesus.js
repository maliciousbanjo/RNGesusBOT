const utils = require('./helpers/utils.js');
const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.json');
const dbUtils = require('./helpers/databaseUtils');
const db = dbUtils.getDbConnection();

// CLIENT SETUP
const myIntents = new Discord.Intents();
myIntents.add('GUILD_MEMBERS', Discord.Intents.NON_PRIVILEGED);

const client = new Discord.Client({
  ws: { intents: myIntents },
  fetchAllMembers: true,
});
client.config = config; // Make config accessible everywhere

db.connect();

fs.readdir('./events/', (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    const event = require(`./events/${file}`);
    let eventName = file.split('.')[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Discord.Collection();

fs.readdir('./commands/', (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    if (!file.endsWith('.js')) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split('.')[0];
    console.log(`Loading command ${commandName}...`);
    client.commands.set(commandName, props);
  });
});

// Event Handlers
client.once('ready', () => {
  console.log('Logged in as ' + client.user.tag);
  // Scan and add new users, emoji to the MySQL database
  client.user.setActivity('God | !help');

  utils.scanUsers(client, config.serverId);
  utils.scanEmoji(client, config.serverId);
});

client.on('error', (error) => {
  console.error(error.message);
});

// LOGIN
client.login(config.token);
