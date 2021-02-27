const Discord = require('discord.js');
const dbUtils = require('../../helpers/databaseUtils');
const db = dbUtils.getDbConnection();

module.exports = {
  /**Command name */
  name: 'server',
  /**Command description */
  description: 'Fetch information about the server.',
  usage: '',
  category: 'Metrics',
  /**
   * Fetch information about the server.
   *
   * @param {Discord.Message} message - Message to process
   */
  run: (message) => {
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
      ORDER BY message_count DESC
      LIMIT 1;
    `;

    db.query(query, (error, result) => {
      if (error) {
        console.error(`MySQL ${error}`);
        throw error;
      }
      const topEmoji = message.guild.emojis.cache.find(
        (emoji) => emoji.name === result[0][0].name,
      );
      const totalMessages = result[1][0].total_messages;
      const msgEmbed = new Discord.MessageEmbed()
        .setColor('BLUE')
        .setTitle(message.guild.name)
        .setThumbnail(message.guild.iconURL())
        .addField(
          'Created',
          message.guild.createdAt.toLocaleDateString('en-us', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        )
        .addField('Top Emoji', `${topEmoji}`)
        .addField('Total Messages', `${totalMessages.toLocaleString()}`, true);

      // This would only be undefined if the database is completely empty
      if (result[2][0] !== undefined) {
        const maxMessageUser = message.guild.members.cache.get(
          result[2][0].discord_id,
        );
        msgEmbed.addField(
          'Top Poster',
          `${maxMessageUser}: ${result[2][0].message_count.toLocaleString()}`,
          true,
        );
      }

      message.channel.send(msgEmbed);
    });
  },
};
