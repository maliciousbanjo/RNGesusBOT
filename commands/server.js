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
        WHERE golden_count > 0
        GROUP BY username, discord_id
        ORDER BY golden_max DESC
        LIMIT 1;
    `;
    // SELECT MAX(user.cosmic_count) as cosmic_max, discord_id, username
    // FROM user
    // WHERE cosmic_max > 0
    // GROUP BY username, discord_id
    // ORDER BY cosmic_max DESC
    // LIMIT 1;

    client.sqlCon.query(query, (error, result, fields) => {
        if (error) throw error;
        const topEmote = client.emojis.find(emoji => emoji.name === result[0][0].name);
        const totalMessages = result[1][0].total_messages;
        if (result[2][0] !== null) {

        }        
        const richEmbed = new Discord.RichEmbed()
        .setColor('BLUE')
        .setTitle(message.guild.name)
        .setThumbnail(message.guild.iconURL)
        .addField('Created', new Date(message.guild.createdAt).toDateString())
        .addField('Top Emote', `${topEmote}`)
        .addField('Total Messages', `${totalMessages}`);

        // This would only be null if the database is completely empty
        if (result[2][0] !== null) {
            const maxMessageUser = message.guild.members.find(user => user.id === result[2][0].discord_id);
            richEmbed.addField('Top Poster', `${maxMessageUser}: ${result[2][0].message_count}`);
        }
        // Check if any golden keks have been awarded
        if (result[3][0] !== null) {
            const maxGoldenUser = message.guild.members.find(user => user.id === result[3][0].discord_id);
            richEmbed.addField('Top Kekker', `${maxGoldenUser}: ${result[3][0].golden_max}`);
        }
        message.channel.send(richEmbed);
    });
}