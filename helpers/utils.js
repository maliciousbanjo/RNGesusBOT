const Discord = require('discord.js');
const dbUtils = require('./databaseUtils');
const db = dbUtils.getDbConnection();

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
      if (error) throw error;
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
        if (error) throw error;
      });
    });
    console.log('Emoji scan complete');
  },
};
