const Discord = require('discord.js');
exports.run = (client, message) => {
    const query = `
        SELECT name, count
        FROM emote
        ORDER BY count DESC 
        LIMIT 1;
        
        SELECT count(*) as total_messages FROM message;

        SELECT user.username, user.discord_id, count(message.author_id) AS 'message_count'
        FROM message LEFT JOIN user
            ON user.discord_id=message.author_id
        GROUP BY username, discord_id 
        ORDER BY message_count
        LIMIT 1;

        SELECT MAX(user.golden_count) as golden_max, discord_id, username
        FROM user
        GROUP BY username
        ORDER BY golden_max DESC
        LIMIT 1;

        SELECT MAX(user.cosmic_count) as cosmic_max, discord_id, username
        FROM user
        GROUP BY username
        ORDER BY cosmic_max DESC
        LIMIT 1;
    `;

    client.sqlCon.query(query, (error, result, fields) => {
        if (error) throw error;
        const topEmote = client.emojis.find(emoji => emoji.name === result[0][0].name);
        const totalMessages = result[1][0].total_messages;
        const maxMessageUser = message.guild.members.find(user => user.id === result[2][0].discord_id);
        const maxGoldenUser = message.guild.members.find(user => user.id === result[3][0].discord_id);
        const maxCosmicUser = message.guild.members.find(user => user.id === result[4][0].discord_id);
        
        const richEmbed = new Discord.RichEmbed()
        .setColor('BLUE')
        .setTitle(message.guild.name)
        .setThumbnail(message.guild.iconURL)
        .addField('Created', new Date(message.guild.createdAt).toDateString())
        .addField('Top Emote', `${topEmote}`)
        .addField('Total Messages', `${totalMessages}`)
        .addField('Top Poster', `${maxMessageUser}: ${result[2][0].message_count}`);

        if (maxGoldenUser !== null) {
            richEmbed.addField('Top Golden Kekker', `${maxGoldenUser}: ${result[3][0].golden_max}`);
        }
        if (maxCosmicUser !== null) {
            richEmbed.addField('Top Cosmic Kekker', `${maxCosmicUser}: ${result[4][0].cosmic_max}`);
        }

        message.channel.send(richEmbed);
    });
}