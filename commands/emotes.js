const Discord = require('discord.js');
exports.run = (client, message) => {
    const query = `
        SELECT name, count
        FROM EMOTE
        ORDER BY count DESC
        LIMIT 5;
    `;

    client.sqlCon.query(query, (error, result, fields) => {
        if (error) throw error;
        let emoteString = ``;
        result.forEach(element => {
            emoteString += `${client.emojis.find(emoji => emoji.name === element.name)}\n`;
        });
        const richEmbed = new Discord.RichEmbed()
        .setColor(3447003)
        .addField('Top Emotes', emoteString);
        message.channel.send(richEmbed);
    });
}