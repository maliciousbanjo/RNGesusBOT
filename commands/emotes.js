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

        // Format ranking strings
        let emoteString = ``;
        for (i = 0; i < result.length; i++) {
            // Fetch the emote from Discord
            const emote = client.emojis.find(emoji => emoji.name === result[i].name);
            emoteString += `${i+1}. ${emote}\n`
        }

        // Build the RichEmbed
        const richEmbed = new Discord.RichEmbed()
            .setColor('BLUE')
            .setTitle(`Top Emotes in ${message.guild.name}`)
            .addField('Emotes', emoteString);
        message.channel.send(richEmbed);
    });
}