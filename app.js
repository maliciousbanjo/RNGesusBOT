require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();

const tokenTest = process.env.TESTING;
const token = process.env.RNGESUS;

client.on('ready', () => {
    console.log("Logged in as " + client.user.tag + "!");
    //const id = client.channels.firstKey();
    const myChannel = client.channels.get("126786138596704256");
    myChannel.send("I am become reborn. Hail.");
});

client.on('message', msg => {
    if (msg.content === 'PRAISE RNGESUS') {
        msg.reply('Yes, praise me.');
        console.log("There has been praise.");
    }
});

//client.login(tokenTest);
client.login(token);