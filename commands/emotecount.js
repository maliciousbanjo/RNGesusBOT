const Discord = require('discord.js');
exports.run = (client, message) => {
    if (message.author.id !== client.config.ownerId) {
        return; // This command is only allowed for the bot owner
    }
    const query = `
        SELECT name, count
        FROM EMOTE
        ORDER BY count DESC
        LIMIT 10;
    `;

    client.sqlCon.query(query, (error, result, fields) => {
        if (error) throw error;
        let emoteString = ``;
        result.forEach(element => {
            emoteString += `${client.emojis.find(emoji => emoji.name === element.name)} | ${element.count}\n`;
        });
        const richEmbed = new Discord.RichEmbed()
        .setColor(3447003)
        .addField('Emote Counts', emoteString);
        message.author.createDM()
        .then(channel => {
            channel.send(richEmbed);
        });
    })
}