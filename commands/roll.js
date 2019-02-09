exports.run = (client, message) => {
    const roll = Math.floor(Math.random() * 21) + 1;
    if (roll != 21) {
        message.reply(roll);
    } else {
        message.reply("Go fuck yourself.");
    }
}