const Discord = require('discord.js');
const packageJson = require('../../package.json');
const config = require('../../config.json');
const utils = require('../../helpers/utils');

module.exports = {
  /**Command name */
  name: 'help',
  /**Command description */
  description: 'List all commands.',
  /**Command usage example */
  usage: '*[command name]',
  category: 'Utility',
  /**
   * List all commands.
   *
   * @param {Discord.Message} message - Message to process.
   * @param {Array.<string>} args - A specific command to list info on.
   */
  run: (message, args) => {
    const { commands } = message.client;

    // Base MessageEmbed
    const msgEmbed = new Discord.MessageEmbed()
      .setColor('BLUE')
      .setThumbnail(message.client.user.avatarURL())
      .setFooter(`Version ${packageJson.version}`);

    if (!args.length) {
      // Send a list of ALL commands
      msgEmbed
        .setTitle(message.client.user.username)
        .setURL(packageJson.repository.url)
        .setDescription(
          `Use \`${config.prefix}help [command]\` to get info on a specific command.`,
        );

      for (const category of message.client.commandCategories) {
        // Do not include "admin" category unless called by an admin
        if (category === 'admin' && !utils.isAdmin(message.author.id)) continue;
        const commandString = commands
          .filter((command) => command.category.toLowerCase() === category)
          .map(
            (command) => `\`${config.prefix}${command.name}\``,
            //`\`${config.prefix}${command.name}\` - ${command.description}`,
          )
          .join('\n');
        msgEmbed.addField(
          category.charAt(0).toUpperCase() + category.slice(1),
          commandString,
          false,
        );
      }
    } else {
      // Send info on a specified command
      const cmdName = args[0].toLowerCase();
      const command = commands.get(cmdName);
      if (!command) {
        message.reply(`Sorry, that's not a valid command.`);
        return;
      } else if (
        command.category === 'Admin' &&
        !utils.isAdmin(message.author.id)
      ) {
        message.reply(`Sorry, you don't have permission to use that command.`);
        return;
      }
      msgEmbed
        .setTitle(config.prefix + command.name)
        .setDescription(command.description)
        .addField(
          'Usage',
          `\`${config.prefix}${command.name}` +
            (command.usage ? ` ${command.usage}\`` : `\``),
        );
    }

    // Finally, send the embed.
    message.channel.send(msgEmbed);
  },
};
