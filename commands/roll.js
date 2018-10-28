exports.run = (client, message, args) => {
    const roll = Math.floor(Math.random() * 21) + 1;
    if (roll != 21) {
        message.reply(roll);
        // If args
        //message.reply(`${roll}, you tried to roll for ${args[0]}`);
    } else {
        message.reply("Go fuck yourself.");
    }
}