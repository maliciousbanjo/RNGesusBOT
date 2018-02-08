require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();

const tokenTest = process.env.TESTING;
const token = process.env.RNGESUS;

client.on('ready', () => {
    console.log("Logged in as " + client.user.tag + "!");
    client.user.setActivity("Walmart-tier God");
    const myChannel = client.channels.get("126786138596704256");
    //const myUser = client.users.get("126846346794762240");
});

client.on('message', msg => {
    if (msg.content === 'PRAISE RNGESUS') {
        msg.reply('Yes, praise me.');
        console.log("There has been praise.");
    }
});

//client.login(tokenTest);
client.login(token);