const utils = require('./../helpers/utils.js');
const Discord = require('discord.js');
const config = require('../config.json');

/**
 * Event handler for guildMemberAdd
 *
 * @param {Discord.Client} client - Discord client connection
 * @param {Discord.GuildMember} guildMember - The new GuildMember
 */
module.exports = (client, guildMember) => {
  // Add the new user to the default role
  const defaultRole = guildMember.guild.roles.cache.find(
    (role) => role.name === config.defaultRole,
  );

  // TODO: Handling for if this role couldn't be found
  guildMember.roles.add(defaultRole.id);
  console.log(`${guildMember.user.username} has joined the server.`);

  // Add the user to the MySQL database
  utils.addUser(guildMember.user);

  const channel = guildMember.guild.channels.resolve(
    client.config.defaultChannelId,
  );

  // TODO: Test this in the real server, see what happens
  if (channel !== undefined) {
    channel.send(`${guildMember.user.username} has joined the Church!`);
  }
};
