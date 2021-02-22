const Discord = require('discord.js');
const config = require('../config.json');

module.exports = {
  /**Command name */
  name: 'test',
  /**Command description */
  description: 'Internal command, used for triggering test scenarios',
  /**
   * Internal command, used for triggering test scenarios
   *
   * @param {Discord.Message} message - Message to process
   */
  run: (message) => {
    if (message.author.id === config.ownerId) {
      message.client.emit('guildMemberAdd', message.member);
    } else {
      message.reply("Sorry, you don't have permission to use that command");
    }
  },
};
