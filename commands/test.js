exports.run = (client, message) => {
    if (message.author.id !== client.config.ownerId) {
        message.reply("No.");
    } else {
        client.emit("guildMemberAdd", message.member);
    }
}