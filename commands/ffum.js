const Discord = require('discord.js');

module.exports = {
  /**Command name */
  name: 'ffum',
  /**Command description */
  description: 'Inverted Muffin face multi-emoji.',
  /**
   * Inverted Muffin face multi-emoji.
   *
   * @param {Discord.Message} message - Message to process
   */
  run: (message) => {
    const muff1 = message.guild.emojis.cache.find(
      (emoji) => emoji.name == 'muff1',
    );
    const muff2 = message.guild.emojis.cache.find(
      (emoji) => emoji.name == 'muff2',
    );
    const muff3 = message.guild.emojis.cache.find(
      (emoji) => emoji.name == 'muff3',
    );
    const muff4 = message.guild.emojis.cache.find(
      (emoji) => emoji.name == 'muff4',
    );
    message.channel.send(`${muff2}${muff1}\n${muff3}${muff4}`);
  },
};
