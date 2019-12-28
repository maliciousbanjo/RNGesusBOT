const Discord = require('discord.js');
exports.run = (client, message) => {
    const query = `
        SELECT name, count
        FROM emote
        WHERE count > 0
        ORDER BY count DESC
        LIMIT 10;
    `;

    client.sqlCon.query(query, (error, result, fields) => {
        if (error) throw error;
        if (result.length == 0) {
            message.channel.send("There are no emotes recorded");
            return;
        }
        let emoteString = ``;
        result.forEach(element => {
            emoteString += `${client.emojis.find(emoji => emoji.name === element.name)}\n`;
        });
        const richEmbed = new Discord.RichEmbed()
            .setColor('BLUE')
            .addField('Top Emotes', emoteString);
        message.channel.send(richEmbed);
    });
}