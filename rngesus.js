require('dotenv').config();
var schedule = require('node-schedule');

const Discord = require('discord.js');
const client = new Discord.Client();

const tokenTest = process.env.TESTING;
const token = process.env.RNGESUS;

client.on('ready', () => {
    console.log("Logged in as " + client.user.tag + "!");
    client.user.setActivity("God | !help");

    // Test Wednesday
    // var wednesday = schedule.scheduleJob("45 12 * * 6", function() {
    //     client.channels.get("303282388237025282").send("https://i.imgur.com/SPDD3R2.jpg");
    // });
    var wednesday = schedule.scheduleJob("0 0 * * 3", function() {
        client.channels.get("126786138596704256").send("https://i.imgur.com/SPDD3R2.jpg");
    });
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
    if (msg.content.toLowerCase().includes("!help")) {
        msg.channel.send(help());
    }
    if (msg.content.toLowerCase().includes("!britbong")) {
        msg.channel.send(britbong());
    }
});

//client.login(tokenTest);
client.login(token);


/*  Name: roll
*   Explicit command, roll a 20-sided die
*/
function roll() {
    const roll = Math.floor(Math.random() * 21) + 1;
    if (roll != 21){
        return roll;
    }
    else {
        console.log("Someone has fucked off.");
        return "Go fuck yourself.";
    }
}

/*  Name: muff
*   Explicit command, return the Muffin face multi-emote
*/
function muff() {
    var response = "<:muff1:260651711381766144><:muff2:260651722114990082>\n" 
        + "<:muff3:260651732382646273><:muff4:260651744927809536>";
    return response;
}

/*  Name: ffum
*   Explicit command, return the inverted Muffin face multi-emote
*/
function ffum() {
    var response = "<:muff2:260651722114990082><:muff1:260651711381766144>\n"
        +"<:muff3:260651732382646273><:muff4:260651744927809536>";
    return response;
}

/*  Name: britbong
*   Explicit command, return the winged pilgrim
*/
function britbong() {
    var response = "<:wingL:347944440272519169><:pilgrim:347944396127469571><:wingR:347944450116288513>";
    return response;
}

/*  Name: help
*   Explicit command, return a list of all other available commands
*/
function help() {
    var embed = {embed: {
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title: "GitHub Link",
        url: "https://github.com/maliciousbanjo/RNGesusBOT",
        description: "I am a just god, because I am unbiased.",
        fields: [{
            name: "Commands",
            value: "!roll - Roll a 20-sided die\n" +
            "!muff - Muffin face multi-emote\n" +
            "!ffum - Inverted Muffin face multi-emote\n" + 
            "!britbong - The winged pilgrim himself"
          },
        ],
      }
    };
    return embed;
}

/*  Name: kekCzech
*   Implicit command, called whenever someone says "kek"
*/
function kekCzech(message) {
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