const Discord = require('discord.js');
exports.run = (client, message) => {
    if (message.author.id !== client.config.ownerId) {
        return; // This command is only allowed for the bot owner
    }
    const query = `
        SELECT name, count
        FROM emote
        WHERE count > 0
        ORDER BY count DESC
        LIMIT 15;
    `;

    client.sqlCon.query(query, (error, result, fields) => {
        if (error) throw error;
        if (result.length == 0) {
            message.author.createDM()
            .then(channel => {
                channel.send("There are no emotes recorded");
            });
            return;
        }
        let emoteString = ``;
        result.forEach(element => {
            emoteString += `${client.emojis.find(emoji => emoji.name === element.name)} ${element.count}\n`;
        });
        const richEmbed = new Discord.RichEmbed()
        .setColor('BLUE')
        .addField('Emote Counts', emoteString);
        message.author.createDM()
        .then(channel => {
            channel.send(richEmbed);
        });
    })
}