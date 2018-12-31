const Discord = require('discord.js');
exports.run = (client, message) => {
    const query = `
        SELECT EMOTE.name as emote, MAX(EMOTE.count), SERVER.name, last_golden_user, last_cosmic_user,
            golden_timestamp, cosmic_timestamp
        FROM SERVER LEFT JOIN (EMOTE)
        ON (SERVER.server_id = EMOTE.server_id)
        GROUP BY emote
        ORDER BY EMOTE.count DESC 
        LIMIT 1;
    `;

    client.sqlCon.query(query, (error, result, fields) => {
        if (error) throw error;
        const topEmote = client.emojis.find(emoji => emoji.name === result[0].emote);
        const goldenUser = message.guild.members.find(user => user.id === result[0].last_golden_user);
        const cosmicUser = message.guild.members.find(user => user.id === result[0].last_cosmic_user);
        
        const richEmbed = new Discord.RichEmbed()
        .setColor(3447003)
        .setTitle(message.guild.name)
        .setThumbnail(message.guild.iconURL)
        .addField('Created', new Date(message.guild.createdAt).toDateString())
        .addField('Top Emote', `${topEmote}`);

        if (goldenUser !== null) {
            const timestamp = new Date(result[0].golden_timestamp);
            richEmbed.addField('Golden Kekker', `${goldenUser.displayName} on ${timestamp.toDateString()}, ${timestamp.toLocaleTimeString('en-US')}`);
        }

        if (cosmicUser !== null) {
            const timestamp = new Date(result[0].cosmic_timestamp);
            richEmbed.addField('Cosmic Kekker', `${cosmicUser.displayName} on ${timestamp.toDateString()}, ${timestamp.toLocaleTimeString('en-US')}`);
        }

        message.channel.send(richEmbed);
    });
}