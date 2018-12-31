const Discord = require('discord.js');
exports.run = (client, message, args) => {
    const numMatch = new RegExp(/\d+/);
    if(numMatch.test(args[0])) {
        // Process UserID out of args array
        const userId = numMatch.exec(args[0])[0];

        // Fetch the Discord user from MySQL
        const query = `
            SELECT * FROM USER
            WHERE discord_id = "${message.author.id}"
        `;
        client.sqlCon.query(query, (error, result, fields) => {
            if (error) throw error;
                // Find user ID from Discord
                const targetUser = message.guild.members.find(user => user.id === userId);
                // Assemble the Embed
                const richEmbed = new Discord.RichEmbed()
                    .setColor(3447003)
                    .setAuthor(targetUser.displayName, targetUser.user.avatarURL)
                    .setThumbnail(targetUser.user.avatarURL)
                    .addField('Role', targetUser.highestRole.name)
                    .addField('User Since', new Date(targetUser.user.createdAt).toDateString())
                    .addField('Joined Server', new Date(targetUser.joinedAt).toDateString())
                    .addField('Messages', result[0].messages);
                if (result[0].golden_kek !== 0) {
                    richEmbed.addField('Golden Keks', result[0].golden_kek)

                }
                if (result[0].cosmic_kek !== 0) {
                    richEmbed.addField('Cosmic Keks', result[0].cosmic_kek);
                }

                message.channel.send(richEmbed);
        });

    } else {
        message.channel.send(`Sorry, I couldn't find that user`);
    }
}