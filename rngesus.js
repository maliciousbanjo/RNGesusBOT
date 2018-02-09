require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();

const tokenTest = process.env.TESTING;
const token = process.env.RNGESUS;

client.on('ready', () => {
    console.log("Logged in as " + client.user.tag + "!");
    client.user.setActivity("I can roll now");
});

client.on('message', msg => {
    if (msg.content.toLowerCase().includes("!roll")) {
        msg.reply(roll());
    }
    if (msg.content.toLowerCase().includes("kek")){
        //msg.reply(kekCzech(msg.author));
        kekCzech(msg);
    }
    if (msg.content.toLowerCase().includes("!muff")) {
        msg.channel.send(muff());
    }
    if (msg.content.toLowerCase().includes("!ffum")) {
        msg.channel.send(ffum());
    }
});

//client.login(tokenTest);
client.login(token);

// Define command/responses
function roll(){
    const roll = Math.floor(Math.random() * 21) + 1;
    if (roll != 21){
        return roll;
    }
    else {
        console.log("Someone has fucked off.");
        return "Go fuck yourself.";
    }
}

function kekCzech(message) {
    // Czech for that kek
    var chance = Math.floor(Math.random() * 20); // Golden kek
    var goldenKek = false;
    if (chance == 0) {
        goldenKek = true;
        console.log(message.author.username + " has received the Golden Kek");
        message.reply("http://i.imgur.com/Qvpx2KK.png");

    }
    if (!(goldenKek)) {
        chance = Math.floor(Math.random() * 250); // Cosmic kek
        if (chance == 0) {
            console.log(message.author.username + " has received the Cosmic Kek");
            message.reply("http://i.imgur.com/MJ4QnXr.jpg");
        }
    }
}

function muff() {
    var response = "<:muff1:260651711381766144><:muff2:260651722114990082>\n" 
        + "<:muff3:260651732382646273><:muff4:260651744927809536>";
    return response;
}

function ffum(){
    var response = "<:muff2:260651722114990082><:muff1:260651711381766144>\n"
        +"<:muff3:260651732382646273><:muff4:260651744927809536>";
    return response;
}