const Discord = require('discord.js');
const dbUtils = require('../../helpers/databaseUtils');
const db = dbUtils.getConnectionPool();

module.exports = {
  /**Command name */
  name: 'emojicount',
  /**Command description */
  description: 'Get the usage count of the top 15 emoji. Sent as a DM.',
  /**Command usage example */
  usage: '',
  category: 'Admin',
  admin: true,
  /**
   * Get the usage count of the top 15 emoji. Sent as a DM.
   *
   * @param {Discord.Message} message - Message to process
   */
  run: (message) => {
    const query = `
      SELECT name, count
      FROM emote
      WHERE count > 0
      ORDER BY count DESC
      LIMIT 15;
    `;

    db.query(query, (error, result) => {
      if (error) {
        console.error(`MySQL ${error}`);
        throw error;
      }
      if (result.length == 0) {
        message.author.createDM().then((dmChannel) => {
          dmChannel.send('There are no emoji recorded');
        });
        return;
      }

      // Format the ranking strings
      let emojiString = ``;
      result.forEach((element) => {
        const emoji = message.guild.emojis.cache.find(
          (emoji) => emoji.name == element.name,
        );
        if (emoji !== undefined) emojiString += `${emoji} ${element.count}\n`;
      });
      const msgEmbed = new Discord.MessageEmbed()
        .setColor('BLUE')
        .setTitle(`Top Emoji in ${message.guild.name}`)
        .addField('Emoji Counts', emojiString);
      message.author.createDM().then((channel) => {
        channel.send(msgEmbed);
      });
    });
  },
};
