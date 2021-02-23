const Discord = require('discord.js');
const packageJson = require('../package.json');
const config = require('../config.json');

module.exports = {
  /**Command name */
  name: 'help',
  /**Command description */
  description: 'List all commands.',
  /**
   * List all commands.
   *
   * @param {Discord.Message} message - Message to process
   */
  run: (message) => {
    const { commands } = message.client;
    const commandStr = commands
      .map(
        (command) =>
          `\`${config.prefix}${command.name}\` - ${command.description}`,
      )
      .join('\n');

    const msgEmbed = new Discord.MessageEmbed()
      .setColor('BLUE')
      .setTitle(message.client.user.username)
      .setDescription('Hello')
      .setThumbnail(message.client.user.avatarURL())
      .setFooter(`Version ${packageJson.version}`)
      .setURL('https://github.com/maliciousbanjo/RNGesusBOT')
      .addField('Commands', commandStr);

    message.channel.send(msgEmbed);
  },
};
