const request = require('request-promise');
const fs = require('fs');
const Discord = require('discord.js');

const client = new Discord.Client();
const tokenTest = process.env.TESTING;
const token = process.env.RNGESUS;

let finalPhase = "";

client.on('ready', () => {
    console.log("Logged in as " + client.user.tag + "!");
    data = JSON.parse(fs.readFileSync("./spook.json"));
    finalPhase = data.phase4;
    if (finalPhase != true){
        client.user.setActivity("Ģ̷̨ơ̴͝d̴ | !help");
    }
    else {
        client.user.setActivity("Ń̘̩̻̩͓̮o̯͚͍̬͈̻ͯͅT͉̀Ḥ̟̙̗̩͈̈́ͥͨͧͯ̐̅͞i̦̥̣̞̋ͭͬ̀n̘ͪ̄̿̿͞G̶̱͈͆ͭ͂ͯ̃̈̈ ̼̏̊c̷͉͍̜͓̮̮̙A̳̮̺͒͆ͫ̀͐Ņ̥͍͚̹̠͊̉ͥͣ ͚̫s̐҉̠͖̻̩̣̮̗a͈̰͈͚̼ͮ̎̃̈́v̵̳̲͔ͪ̂̔E̝̟̩͕̤̩̅̋ ̣ͧ̍̃́Y̼̩oͭ҉̤̹U͖̪͔̜̣̙̻͂ͦ̆͘");
    }
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

    if(msg.content.toLowerCase().includes("!test")) {
        msg.reply(test());
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

function updatePhase() {
    data = JSON.parse(fs.readFileSync("./spook.json"));
    data.phase4 = true;
    finalPhase = true;
    fs.writeFileSync("./spook.json", JSON.stringify(data, null, 4));
    
    client.user.setActivity("Ń̘̩̻̩͓̮o̯͚͍̬͈̻ͯͅT͉̀Ḥ̟̙̗̩͈̈́ͥͨͧͯ̐̅͞i̦̥̣̞̋ͭͬ̀n̘ͪ̄̿̿͞G̶̱͈͆ͭ͂ͯ̃̈̈ ̼̏̊c̷͉͍̜͓̮̮̙A̳̮̺͒͆ͫ̀͐Ņ̥͍͚̹̠͊̉ͥͣ ͚̫s̐҉̠͖̻̩̣̮̗a͈̰͈͚̼ͮ̎̃̈́v̵̳̲͔ͪ̂̔E̝̟̩͕̤̩̅̋ ̣ͧ̍̃́Y̼̩oͭ҉̤̹U͖̪͔̜̣̙̻͂ͦ̆͘");
}

function test() {
    console.log("All hail the golden spooky");
}

/**  
 * Explicit command, roll a 20-sided die
 */
function roll() {
    if (finalPhase != true) {
        const roll = Math.floor(Math.random() * 21) + 1;
        if (roll != 21) {
            return roll;
        } else {
            console.log("All hail the golden spooky");
            return spooky.spookySass.phase3[Math.floor(Math.random()*spooky.spookySass.phase3.length)];
        }
    } else { // final phase has been triggered
        const statement =  spooky.spookySass.phase4[Math.floor(Math.random()*spooky.spookySass.phase4.length)];
        const emote = spooky.muffMotes[Math.floor(Math.random()*spooky.muffMotes.length)]
        return diacrit(statement) + " " + emote;
    }
}

/**  
 * Explicit command, return the Muffin face multi-emote
 */
function muff() {
    const response = "<:muff1:260651711381766144><:muff2:260651722114990082>\n"
        + "<:muff3:260651732382646273><:muff4:260651744927809536>";
    return response;
}

/**  
 * Explicit command, return the inverted Muffin face multi-emote
 */
function ffum() {
    const response = "<:muff2:260651722114990082><:muff1:260651711381766144>\n"
        +"<:muff3:260651732382646273><:muff4:260651744927809536>";
    return response;
}

/**  
 * Explicit command, return the winged pilgrim
 */
function pilgrim() {
    const response = "<:wingL:347944440272519169><:pilgrim:347944396127469571><:wingR:347944450116288513>";
    return response;
}

/**
 * Explicit command, return the Monster Hunter World weakness chart
 */
function weakness() {
    const response = "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw_monster_weakness_chart.png";
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
        var dirtyDate = JSON.stringify(new Date());
        var currentDate = dirtyDate.substr(1, dirtyDate.length - 1);
        if (currentDate < spooky.spookyDates.phase1) {
            message.reply("", {file: new Discord.Attachment("./img/spooky_kek_s1.png", "p1.png")});
            //message.reply(spooky.spooky.phase1);
        } else if (currentDate >= spooky.spookyDates.phase1 && currentDate < spooky.spookyDates.phase2) {
            message.reply("", {file: new Discord.Attachment("./img/spooky_kek_s2.png", "p2.png")});
            //message.reply(spooky.spooky.phase2);
        } else if (currentDate >= spooky.spookyDates.phase2 && currentDate < spooky.spookyDates.phase3) {
            message.reply("", {file: new Discord.Attachment("./img/spooky_kek_s3.png", "p3.png")});
            //message.reply(spooky.spooky.phase3);
        } else if (currentDate >= spooky.spookyDates.phase3 && currentDate < spooky.spookyDates.phase4) {
            if (finalPhase != true) {
                updatePhase();
                message.reply("", {file: new Discord.Attachment("./img/spooky_kek_s4.png", "p4.png")});
                message.channel.send("<:muffrage:486743510587015168>"
                    + diacrit("I RISE") + "<:muffrage:486743510587015168>");
            } else {
                message.reply("", {file: new Discord.Attachment("./img/spooky_kek_s4.png", "p4.png")});
                const statement =  spooky.spookySass.phase4[Math.floor(Math.random()*spooky.spookySass.phase4.length)];
                const emote = spooky.muffMotes[Math.floor(Math.random()*spooky.muffMotes.length)]
                message.channel.send(diacrit(statement) + " " + emote);
                //message.reply(spooky.spooky.phase4);
            }
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