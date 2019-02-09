exports.run = (client, message) => {
    if (message.author.id === "234395566229028869") {
        return;
        // Rob is not allowed to roll Reeeee
    }
    const roll = Math.floor(Math.random() * 21) + 1;
    if (roll != 21) {
        message.reply(roll);
    } else {
        message.reply("Go fuck yourself.");
    }
}