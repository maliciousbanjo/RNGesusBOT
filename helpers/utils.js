const Discord = require('discord.js');
const config = require('../config.json');
const dbUtils = require('./databaseUtils');
const db = dbUtils.getConnectionPool();

module.exports = {
  /**
   * Scan the server and add all users to the database.
   *
   * @param {Discord.Client} client - Discord client connection
   * @param {string} serverId - ID of the server to scan
   */
  scanUsers: (client, serverId) => {
    console.log('Scanning users...');
    const guild = client.guilds.cache.get(serverId);
    guild.members.cache.each((guildMember) => {
      module.exports.addUser(guildMember.user, client);
    });
    console.log('User scan complete.');
  },

  /**
   * Add a user to the database
   *
   * @param {Discord.User} user - User to add
   */
  addUser: (user) => {
    const query = `
      INSERT IGNORE INTO user(discord_id, username)
      VALUES ("${user.id}", "${user.username}")
    `;
    console.log(`Adding user ${user.username} to database`);
    db.query(query, (error) => {
      if (error) {
        console.error(`MySQL ${error}`);
        throw error;
      }
    });
  },

  // TODO: I think this could be a multi-query. Make this and ScanUsers look similar.
  /**
   * Scan the server for emoji and add them to the database (if new)
   *
   * @param {Discord.Client} client - Discord client connection
   */
  scanEmoji: (client) => {
    console.log('Scanning emoji...');
    let query = ``;
    client.emojis.cache.each((emoji) => {
      query = `
        INSERT IGNORE INTO emote (name, emote_id)
        VALUES ("${emoji.name}", "${emoji.id}")
      `;
      console.log(`Adding emoji ${emoji.name} to database`);
      db.query(query, (error) => {
        if (error) {
          console.error(`MySQL ${error}`);
          throw error;
        }
      });
    });
    console.log('Emoji scan complete');
  },

  /**
   * Verify a user is listed in the config file as a BotAdmin.
   *
   * @param {string} userId - User ID to check permissions.
   * @returns {boolean} True if admin.
   */
  isAdmin: (userId) => {
    if (config.botAdmin.includes(userId)) {
      return true;
    } else {
      return false;
    }
  },

  /**
   * Validate all of the fields in the config file
   *
   * @param {Discord.Client} client - Discord client connection
   * @returns {boolean} True if config is valid
   */
  validateConfig: (client) => {
    // Token handled by login
    // Database handled by MySQL

    // prefix
    if (!config.prefix) {
      console.error('prefix cannot be null');
      return false;
    }

    // serverId
    const guild = client.guilds.cache.get(config.serverId);
    if (!guild) {
      console.error('config.serverId could not be validated.');
      return false;
    }
    // defaultChannelId
    if (!guild.channels.cache.get(config.defaultChannelId)) {
      console.error('config.defaultChannelId could not be validated.');
      return false;
    }
    // ignoreChannels
    for (const channelId of config.ignoreChannels) {
      if (!guild.channels.cache.get(channelId)) {
        console.error(
          `config.ignoreChannels["${channelId}"] could not be validated.`,
        );
        return false;
      }
    }
    // defaultRole
    if (!guild.roles.cache.find((role) => role.name === config.defaultRole)) {
      console.error('config.defaultRole could not be validated.');
      return false;
    }

    console.log('Configuration validated.');
    return true;
  },
};
