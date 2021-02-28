const Discord = require('discord.js');
const dbUtils = require('../../helpers/databaseUtils');
const db = dbUtils.getDbConnection();

module.exports = {
  /**Command name */
  name: 'emoji',
  /**Command description */
  description: 'Get the top 10 emoji.',
  /**Command usage example */
  usage: '',
  category: 'Metrics',
  /**
   * Get the top 10 emoji.
   *
   * @param {Discord.Message} message - Message to process
   */
  run: (message) => {
    const query = `
      SELECT name, count
      FROM emote
      WHERE count > 0
      ORDER BY count DESC
      LIMIT 10;
    `;

    db.query(query, (error, result) => {
      if (error) {
        console.error(`MySQL ${error}`);
        throw error;
      }
      if (result.length == 0) {
        message.channel.send('There are no emoji recorded');
        return;
      }

      // Format ranking strings
      let emojiString = ``;
      result.forEach((element) => {
        // Find the corresponding emoji in the Guild
        const emoji = message.guild.emojis.cache.find(
          (emoji) => emoji.name == element.name,
        );
        if (emoji !== undefined) emojiString += `${emoji}\n`;
      });

      // Build the Embed
      const msgEmbed = new Discord.MessageEmbed()
        .setColor('BLUE')
        .setTitle(`Top Emoji in ${message.guild.name}`)
        .addField('Emoji', emojiString);
      message.channel.send(msgEmbed);
    });
  },
};
