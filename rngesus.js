const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

//client.login(config.production); // production
client.login(config.testing); // testing

// Event Handlers
client.on('ready', () => {
    console.log('Logged in as ' + client.user.tag);
    client.user.setActivity('God | !info');
});

client.on('message', (message) => {
    if (!message.author.bot) {
        message.channel.send("Hi");
    }
});