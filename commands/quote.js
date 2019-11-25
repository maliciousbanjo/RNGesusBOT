const Discord = require('discord.js');
exports.run = (client, message, quoteMessageId) => {
    message.channel.fetchMessage(quoteMessageId[0])
        .then(quoteMessage => {
            // Format quote as a RichEmbed, for prettiness
            const targetUser = message.guild.members.find(user => user.id === quoteMessage.author.id);
            const quoteEmbed = new Discord.RichEmbed()
                .setColor('AQUA')
                .setAuthor(targetUser.displayName, targetUser.user.avatarURL)
                .setDescription(`*${quoteMessage.content}*`)
                .setTimestamp(quoteMessage.createdTimestamp);
            message.channel.send(quoteEmbed);

            // Delete bot command to look more natural
            message.delete()
                .catch(console.error);
        })
        .catch((error) => {
            console.error("Error fetching quote");
            console.error(error);
        });
}