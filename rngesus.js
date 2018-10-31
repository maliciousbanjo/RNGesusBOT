require('dotenv').config();
const request = require('request-promise');
const diacrit = require('diacriticize');
const fs = require('fs');
const Discord = require('discord.js');
const spooky = require('./spook.json');

const client = new Discord.Client();
const tokenTest = process.env.TESTING;
const token = process.env.RNGESUS;

let finalPhase = "";
let rollCount = 0;

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
        //msg.reply(roll());
        msg.reply(spookRoll());
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

    if (msg.content.toLowerCase().includes("!hail")) {
        if (msg.author.id == "126783002549157888") {
            msg.channel.send("This meme has been brought to you buy Muff and Joe. Happy SpookTober 2018!");
        } else {
            return; // Do nothing
        }
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

function spookRoll() {
    // 0 1 2 3 4 5 6
    switch(rollCount) {
        case 0:
            rollCount++;
            return diacrit("God");
        case 1:
            rollCount++;
            return diacrit("is");

        case 2:
            rollCount++;
            return diacrit("dead");

        case 3:
            rollCount++;
            return diacrit("there");
        case 4:
            rollCount++;
            return diacrit("is");
        case 5:
            rollCount++;
            return diacrit("only");
        case 6:
            rollCount = 0;
            return diacrit("M U F F");
    }
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
        const statement =  spooky.spookySass.phase5[Math.floor(Math.random()*spooky.spookySass.phase5.length)];
        let muffMotes = new Array(client.emojis.find(emoji => emoji.name === "muff1"));
        muffMotes.push(client.emojis.find(emoji => emoji.name === "muff2"));
        muffMotes.push(client.emojis.find(emoji => emoji.name === "muff3"));
        muffMotes.push(client.emojis.find(emoji => emoji.name === "muff4"));
        muffMotes.push(client.emojis.find(emoji => emoji.name === "muffrage"));
        muffMotes.push(client.emojis.find(emoji => emoji.name === "muffW"));
        muffMotes.push(client.emojis.find(emoji => emoji.name === "muff"));
        const emote = muffMotes[Math.floor(Math.random()*muffMotes.length)]
        return diacrit(statement) + " " + emote;
    }
}

/**  
 * Explicit command, return the Muffin face multi-emote
 */
function muff() {
    const muff1 = client.emojis.find(emoji => emoji.name === "muff1");
    const muff2 = client.emojis.find(emoji => emoji.name === "muff2");
    const muff3 = client.emojis.find(emoji => emoji.name === "muff3");
    const muff4 = client.emojis.find(emoji => emoji.name === "muff4");

    return `${muff1}${muff2}\n${muff3}${muff4}`;
}

/**  
 * Explicit command, return the inverted Muffin face multi-emote
 */
function ffum() {
    const muff1 = client.emojis.find(emoji => emoji.name === "muff1");
    const muff2 = client.emojis.find(emoji => emoji.name === "muff2");
    const muff3 = client.emojis.find(emoji => emoji.name === "muff3");
    const muff4 = client.emojis.find(emoji => emoji.name === "muff4");

    return `${muff2}${muff1}\n${muff3}${muff4}`;
}

/**
 * Explicit command, return the Monster Hunter World weakness chart
 */
function weakness() {
    const response = "YES, YOU ARE WEAK";
    return response;
}

/**  
 * Explicit command, return a list of all other available commands
 */
function help() {
    return "NOTHING CAN HELP YOU NOW";
}

/**  
 * Implicit command, called whenever someone says "kek"
 */
function kekCzech(message) {
    if (message.author.id == "126783002549157888" || message.author.id == "126783158803759104") {
        message.reply("", {file: new Discord.Attachment("./img/spooky_kek_s5.png", "p5.png")});
        const statement =  spooky.spookySass.phase5[Math.floor(Math.random()*spooky.spookySass.phase5.length)];
        let muffMotes = new Array(client.emojis.find(emoji => emoji.name === "muff1"));
        muffMotes.push(client.emojis.find(emoji => emoji.name === "muff2"));
        muffMotes.push(client.emojis.find(emoji => emoji.name === "muff3"));
        muffMotes.push(client.emojis.find(emoji => emoji.name === "muff4"));
        muffMotes.push(client.emojis.find(emoji => emoji.name === "muffrage"));
        muffMotes.push(client.emojis.find(emoji => emoji.name === "muffW"));
        muffMotes.push(client.emojis.find(emoji => emoji.name === "muff"));
        const emote = muffMotes[Math.floor(Math.random()*muffMotes.length)]
        message.channel.send(diacrit(statement) + " " + emote);
        return;
    } else {
        return;
    }
}