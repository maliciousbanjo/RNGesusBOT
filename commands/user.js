const Discord = require('discord.js');
exports.run = (client, message, userTag) => {
  const numMatch = new RegExp(/\d+/);
  if (numMatch.test(userTag[0])) {
    // Process UserID out of args array
    const userId = numMatch.exec(userTag[0])[0];

    const query = `
      SELECT user.*, count(message.author_id) AS 'message_count'
      FROM message LEFT JOIN user
        ON user.discord_id=message.author_id
      WHERE user.discord_id="${userId}"
      GROUP BY user.username
      LIMIT 1;
      `;

    client.sqlCon.query(query, (error, result) => {
      if (error) throw error;
      // Find user ID from Discord
      message.guild.members.fetch(userId).then((guildMember) => {
        // Assemble the Embed
        const richEmbed = new Discord.MessageEmbed()
          .setColor('BLUE')
          //.setAuthor(targetUser.displayName, targetUser.user.avatarURL)
          .setTitle(guildMember.displayName)
          .setThumbnail(guildMember.user.displayAvatarURL())
          .addField('Role', guildMember.roles.highest.name)
          .addField(
            'User Since',
            guildMember.user.createdAt.toLocaleDateString('en-us', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            true,
          )
          .addField(
            'Joined Server',
            guildMember.joinedAt.toLocaleDateString('en-us', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            true,
          );

        if (typeof result[0] != 'undefined') {
          // Check if query received results
          if (result[0].message_count) {
            richEmbed.addField(
              'Messages',
              result[0].message_count.toLocaleString(),
              true,
            );
          }
          if (result[0].kek_count !== 0) {
            richEmbed.addField(
              'Kek Attempts',
              result[0].kek_count.toLocaleString(),
              true,
            );
          }
          if (result[0].golden_count !== 0) {
            richEmbed.addField(
              'Golden Keks',
              result[0].golden_count.toLocaleString(),
              true,
            );
          }
          if (result[0].kek_count !== 0 && result[0].golden_count !== 0) {
            const kekRatio = (
              result[0].golden_count / result[0].kek_count
            ).toFixed(3);
            richEmbed.addField('Kek Ratio', kekRatio, true);
          }
        } else {
          // This user has not posted any messages
          richEmbed.addField('Messages', 0);
        }

        message.channel.send(richEmbed);
      });
    });
  } else {
    message.channel.send(`Sorry, I couldn't find that user`);
  }
};
