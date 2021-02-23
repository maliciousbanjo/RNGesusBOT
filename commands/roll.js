const Discord = require('discord.js');

module.exports = {
  /**Command name */
  name: 'roll',
  /**Command description */
  description: 'Roll a 20-sided die.',
  /**
   * Roll a 20-sided die.
   *
   * @param {Discord.Message} message - Message to process
   */
  run: (message) => {
    const roll = Math.floor(Math.random() * 21) + 1;
    if (roll != 21) {
      message.reply(roll);
    } else {
      message.reply('Go fuck yourself.');
    }
  },
};
