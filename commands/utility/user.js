const Discord = require('discord.js');
const dbUtils = require('../../helpers/databaseUtils');
const db = dbUtils.getDbConnection();

module.exports = {
  /**Command name */
  name: 'user',
  /**Command description */
  description: 'Fetch information about a user.',
  usage: '<user>',
  category: 'Utility',
  /**
   * Fetch information about a user.
   *
   * @param {Discord.Message} message - Message to process. Must contain a tagged user.
   */
  run: (message) => {
    if (message.mentions.users.size) {
      const user = message.mentions.users.first();

      const query = `
        SELECT user.*, count(message.author_id) AS 'message_count'
        FROM message LEFT JOIN user
          ON user.discord_id=message.author_id
        WHERE user.discord_id="${user.id}"
        GROUP BY user.username
        LIMIT 1;
      `;
      db.query(query, (error, result) => {
        if (error) {
          console.error(`MySQL ${error}`);
          throw error;
        }
        // Find user ID from Discord
        message.guild.members.fetch(user.id).then((guildMember) => {
          // Assemble the Embed
          const msgEmbed = new Discord.MessageEmbed()
            .setColor('BLUE')
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
              msgEmbed.addField(
                'Messages',
                result[0].message_count.toLocaleString(),
                true,
              );
            }
            if (result[0].kek_count !== 0) {
              msgEmbed.addField(
                'Kek Attempts',
                result[0].kek_count.toLocaleString(),
                true,
              );
            }
            if (result[0].golden_count !== 0) {
              msgEmbed.addField(
                'Golden Keks',
                result[0].golden_count.toLocaleString(),
                true,
              );
            }
            if (result[0].kek_count !== 0 && result[0].golden_count !== 0) {
              const kekRatio = (
                result[0].golden_count / result[0].kek_count
              ).toFixed(3);
              msgEmbed.addField('Kek Ratio', kekRatio, true);
            }
          } else {
            // This user has not posted any messages
            msgEmbed.addField('Messages', 0);
          }

          message.channel.send(msgEmbed);
        });
      });
    } else {
      message.channel.send('You need to tag a user to use this command');
    }
  },
};
