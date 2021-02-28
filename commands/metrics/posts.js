const Discord = require('discord.js');
const dbUtils = require('../../helpers/databaseUtils');
const db = dbUtils.getDbConnection();

module.exports = {
  /**Command name */
  name: 'posts',
  /**Command description */
  description: 'List the top 10 posters in the server.',
  /**Command usage example */
  usage: '*<user>',
  category: 'Metrics',
  /**
   * List the top 10 posters in the server.
   *
   * @param {Discord.Message} message - Message to process
   */
  run: (message) => {
    // No user was tagged; list the top 10 posters
    const query = `
      SELECT user.username, user.discord_id, count(message.author_id) AS 'message_count' 
      FROM message LEFT JOIN user 
          ON user.discord_id=message.author_id 
      WHERE user.discord_id!='${message.client.user.id}'
      GROUP BY discord_id 
      ORDER BY message_count 
      DESC LIMIT 10
    `;

    db.query(query, (error, result) => {
      if (error) {
        console.error(`MySQL ${error}`);
        throw error;
      }
      if (result.length === 0) {
        message.channel.send('There are no recorded messages');
        return;
      }

      // Format ranking strings
      let memberStr = ``;
      for (let i = 0; i < result.length; i++) {
        // Get the user profile from Discord
        const guildMember = message.guild.members.cache.get(
          result[i].discord_id,
        );
        memberStr += `${i + 1}. ${guildMember} - ${result[
          i
        ].message_count.toLocaleString()}\n`;
      }

      // Build the RichEmbed
      const msgEmbed = new Discord.MessageEmbed()
        .setColor('BLUE')
        .setTitle(`Top Posters in ${message.guild.name}`)
        .setThumbnail(message.guild.iconURL())
        .addField('Users', memberStr);

      message.channel.send(msgEmbed);
    });
  },
};
