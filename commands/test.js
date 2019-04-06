exports.run = (client, message) => {
    if (message.author.id !== client.config.ownerId) {
        message.reply("No.");
    }
}