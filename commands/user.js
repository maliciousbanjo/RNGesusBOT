const Discord = require('discord.js');
const utils = require('../helpers/utils.js');
exports.run = (client, message, userTag) => {
    const numMatch = new RegExp(/\d+/);
    if(numMatch.test(userTag[0])) {
        // Process UserID out of args array
        const userId = numMatch.exec(userTag[0])[0];

        const query = `
            SELECT user.*, count(message.author_id) AS 'message_count'
            FROM message LEFT JOIN user
                ON user.discord_id=message.author_id
            WHERE user.discord_id="${userId}"
            GROUP BY user.username
        `;
        client.sqlCon.query(query, (error, result, fields) => {
            if (error) throw error;
            // Find user ID from Discord
            const targetUser = message.guild.members.find(user => user.id === userId);
            // Assemble the Embed
            const richEmbed = new Discord.RichEmbed()
                .setColor('BLUE')
                //.setAuthor(targetUser.displayName, targetUser.user.avatarURL)
                .setTitle(targetUser.displayName)
                .setThumbnail(targetUser.user.avatarURL)
                .addField('Role', targetUser.highestRole.name)
                .addField('User Since', utils.formatDate(targetUser.user.createdAt), true)
                .addField('Joined Server', utils.formatDate(targetUser.joinedAt), true);
                
            if (typeof result[0] != 'undefined') { // Check if query received results
                if (result[0].message_count) {
                    richEmbed.addField('Messages', result[0].message_count.toLocaleString(), true);
                }
                if (result[0].kek_count !== 0) {
                    richEmbed.addField('Kek Attempts', result[0].kek_count.toLocaleString(), true);
                }
                if (result[0].golden_count !== 0) {
                    richEmbed.addField('Golden Keks', result[0].golden_count.toLocaleString(), true);
                }
                if (result[0].kek_count !== 0 && result[0].golden_count !== 0) {
                    const kekRatio = (result[0].golden_count / result[0].kek_count).toFixed(3);
                    richEmbed.addField('Kek Ratio', kekRatio, true);
                }

            } else {
                // This user has not posted any messages
                richEmbed.addField('Messages', 0);
            }

            message.channel.send(richEmbed);
        });

    } else {
        message.channel.send(`Sorry, I couldn't find that user`);
    }
}