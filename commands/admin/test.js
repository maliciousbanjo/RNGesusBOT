const Discord = require('discord.js');

module.exports = {
  /**Command name */
  name: 'test',
  /**Command description */
  description: 'Internal command, used for triggering test scenarios.',
  /**Command usage example */
  usage: '',
  category: 'Admin',
  admin: true,
  /**
   * Internal command, used for triggering test scenarios.
   *
   * @param {Discord.Message} message - Message to process
   */
  run: (message) => {
    message.client.emit('guildMemberAdd', message.member);
  },
};
