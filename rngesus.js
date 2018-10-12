require('dotenv').config();
var request = require('request-promise');
var schedule = require('node-schedule');
const Discord = require('discord.js');
const spooky = require('./spook.json');

const client = new Discord.Client();
const tokenTest = process.env.TESTING;
const token = process.env.RNGESUS;

client.on('ready', () => {
    console.log("Logged in as " + client.user.tag + "!");
    client.user.setActivity("God | !help");
});

client.on('message', msg => {
    if (msg.content.toLowerCase().includes("!roll")) {
        msg.reply(roll());
    }

    if (msg.content.toLowerCase().includes("kek")) {
        kekCzech(msg);
    }

    if (msg.content.toLowerCase().includes("!weakness")) {
        msg.channel.send(weakness());
    }

    if (msg.content.toLowerCase().includes("!muff")) {
        if (randomizerOdds(10)) {
            insultMe().then(result => {
                msg.channel.send(result);
            });
        } else {
            msg.channel.send(muff());
        }
    }

    if (msg.content.toLowerCase().includes("!ffum")) {
        if (randomizerOdds(10)) {
            insultMe().then(result => {
                msg.channel.send(result);
            });
        } else {
            msg.channel.send(ffum());
        }
    }

    if (msg.content.toLowerCase().includes("!help")) {
        msg.channel.send(help());
    }
    
    if (msg.content.toLowerCase().includes("!pilgrim")) {
        if (randomizerOdds(10)) {
            insultMe().then(result => {
                msg.channel.send(result);
            });
        } else {
            msg.channel.send(pilgrim());
        }
    }

    if(msg.content.toLowerCase().includes("!insult")) {
        insultMe().then(result => {
            msg.channel.send(result);
        });
    }
});

//client.login(tokenTest);
client.login(token);

/**
 * Determine a random number in a certain range. If 0, return true.
 * @param {number} number - Highest odd
 */
function randomizerOdds(number) {
    const roll = Math.floor(Math.random() * (number));
    if (roll == 0) {
        return true;
    } else {
        return false;
    }
}

/**  
 * Explicit command, roll a 20-sided die
 */
function roll() {
    const roll = Math.floor(Math.random() * 21) + 1;
    if (roll != 21) {
        return roll;
    } else {
        console.log("Someone has fucked off.");
        return "Go fuck yourself.";
    }
}

/**  
 * Explicit command, return the Muffin face multi-emote
 */
function muff() {
    var response = "<:muff1:260651711381766144><:muff2:260651722114990082>\n"
        + "<:muff3:260651732382646273><:muff4:260651744927809536>";
    return response;
}

/**  
 * Explicit command, return the inverted Muffin face multi-emote
 */
function ffum() {
    var response = "<:muff2:260651722114990082><:muff1:260651711381766144>\n"
        +"<:muff3:260651732382646273><:muff4:260651744927809536>";
    return response;
}

/**  
 * Explicit command, return the winged pilgrim
 */
function pilgrim() {
    var response = "<:wingL:347944440272519169><:pilgrim:347944396127469571><:wingR:347944450116288513>";
    return response;
}

/**
 * Explicit command, return the Monster Hunter World weakness chart
 */
function weakness() {
    var response = "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw_monster_weakness_chart.png";
    return response;
}

/**  
 * Explicit command, return a list of all other available commands
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
            "!pilgrim - The winged pilgrim himself\n" +
            "!weakness - Display the MHW Weakness Chart"
          },
        ],
      }
    };
    return embed;
}

/**  
 * Implicit command, called whenever someone says "kek"
 */
function kekCzech(message) {
    var chance = Math.floor(Math.random() * 20); // Golden kek
    var goldenKek = false;
    if (chance == 0) {
        goldenKek = true;
        console.log(message.author.username + " has received the Golden Kek");
        // message.reply("http://i.imgur.com/Qvpx2KK.png"); // Standard Kek
        var currentDate = JSON.stringify(new Date());
        if (currentDate < spooky.spookyDates.phase1) {
            message.reply(spooky.spooky.phase1);
        } else if (currentDate >= spooky.spookyDates.phase1 && currentDate < spooky.spookyDates.phase2) {
            message.reply(spooky.spooky.phase2);
        } else if (currentDate >= spooky.spookyDates.phase2 && currentDate < spooky.spookyDates.phase3) {
            message.reply(spooky.spooky.phase3);
        } else if (currentDate >= spooky.spookyDates.phase3 && currentDate < spooky.spookyDates.phase4) {
            message.reply(spooky.spooky.phase4);
        }
    }
    if (!(goldenKek)) {
        chance = Math.floor(Math.random() * 250); // Cosmic kek
        if (chance == 0) {
            console.log(message.author.username + " has received the Cosmic Kek");
            message.reply("http://i.imgur.com/MJ4QnXr.jpg");
        }
    }
}

/**
 * Provide a random insult
 */
function insultMe() {
    // Query the Insult API
    const options = {
        method: "GET",
        uri: "https://insult.mattbas.org/api/insult.json",
        json: true
    }

    return request(options)
    .then(body => {
        console.log(body);
        return body.insult;
    });
}