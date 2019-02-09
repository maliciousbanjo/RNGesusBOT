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

        SELECT MAX(USER.messages) as messageCount, discord_id, username
        FROM USER
        GROUP BY username
        ORDER BY messageCount DESC
        LIMIT 1;

        SELECT MAX(USER.golden_kek) as golden_max, discord_id, username
        FROM USER
        GROUP BY username
        ORDER BY golden_max DESC
        LIMIT 1;

        SELECT MAX(USER.cosmic_kek) as cosmic_max, discord_id, username
        FROM USER
        GROUP BY username
        ORDER BY cosmic_max DESC
        LIMIT 1;
    `;

    client.sqlCon.query(query, (error, result, fields) => {
        if (error) throw error;
        const topEmote = client.emojis.find(emoji => emoji.name === result[0][0].emote);
        const goldenUser = message.guild.members.find(user => user.id === result[0][0].last_golden_user);
        const cosmicUser = message.guild.members.find(user => user.id === result[0][0].last_cosmic_user);
        const maxMessage = message.guild.members.find(user => user.id === result[1][0].discord_id);
        const maxGolden = message.guild.members.find(user => user.id === result[2][0].discord_id);
        const maxCosmic = message.guild.members.find(user => user.id === result[3][0].discord_id);
        
        const richEmbed = new Discord.RichEmbed()
        .setColor(3447003)
        .setTitle(message.guild.name)
        .setThumbnail(message.guild.iconURL)
        .addField('Created', new Date(message.guild.createdAt).toDateString())
        .addField('Top Emote', `${topEmote}`)
        .addField('Top Poster', `${maxMessage}: ${result[1][0].messageCount}`);

        if (goldenUser !== null) {
            const timestamp = new Date(result[0][0].golden_timestamp);
            richEmbed.addField('Last Golden Kek', `${goldenUser} on ${timestamp.toDateString()}, ${timestamp.toLocaleTimeString('en-US')}`)
            .addField('Top Golden Kekker', `${maxGolden}: ${result[2][0].golden_max}`);
        }
        if (cosmicUser !== null) {
            const timestamp = new Date(result[0][0].cosmic_timestamp);
            richEmbed.addField('Last Cosmic Kek', `${cosmicUser} on ${timestamp.toDateString()}, ${timestamp.toLocaleTimeString('en-US')}`)
            .addField('Top Cosmic Kekker', `${maxCosmic}: ${result[3][0].cosmic_max}`);
        }

        message.channel.send(richEmbed);
    });
}