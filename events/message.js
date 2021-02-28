const Discord = require('discord.js');
const config = require('../config.json');
const utils = require('../helpers/utils');
const dbUtils = require('../helpers/databaseUtils');
const db = dbUtils.getDbConnection();

/**
 * Event handler for message
 *
 * @param {Discord.Client} client - Discord client connection
 * @param {Discord.Message} message - Incoming message to process
 */
module.exports = (client, message) => {
  // Ignore bots and testing channel
  if (message.author.bot) return;

  // Add message info to DB, this is used for user message count
  if (!config.ignoreChannels.includes(message.channel.id)) {
    addMessageToDB(client, message);
  }

  // Filter message for custom emoji
  checkForEmoji(client, message);

  // Scan for command, execute if applicable
  if (message.content.indexOf(config.prefix) === 0) {
    const args = message.content
      .slice(config.prefix.length)
      .trim()
      .split(/ +/g);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) {
      message.reply(`Sorry, that's not a valid command.`);
      return;
    }

    try {
      const cmd = client.commands.get(command);
      if (cmd.admin) {
        // This command is only allowed to bot admins
        if (!utils.isAdmin(message.author.id)) {
          message.reply(
            `Sorry, you don't have permission to use that command.`,
          );
          return;
        }
      }

      cmd.run(message, args);
    } catch (error) {
      console.error(error);
      message.reply('There was an error trying to run that command.');
    }
  }
};

/**
 * Insert a record of a new message
 *
 * @param {Discord.Client} client - Discord client connection
 * @param {Discord.Message} message - Message to add
 */
const addMessageToDB = (client, message) => {
  const timestamp = Math.round(message.createdAt.getTime() / 1000);
  const query = `
    INSERT INTO message (message_id, author_id, channel_id, epoch)
    VALUES ("${message.id}", "${message.author.id}", "${message.channel.id}", ${timestamp})
  `;

  db.query(query, (error) => {
    if (error) {
      console.error(`MySQL ${error}`);
      throw error;
    }
  });
};

/**
 * Check if a message contains emoji. If it does, update each unique instance of an emoji.
 *
 * @param {Discord.Client} client - Discord client connection
 * @param {Discord.Message} message - Message to scan
 */
const checkForEmoji = (client, message) => {
  const emojiSet = [...new Set(message.content.match(/<:\w*:\d*>/gm))];
  if (emojiSet !== null) {
    emojiSet.forEach((identifier) => {
      const emojiName = identifier.match(/:(.*?):/)[1]; // Parse out emoji name
      const emoji = message.guild.emojis.cache.find(
        (emoji) => emoji.name === emojiName,
      );
      if (emoji !== undefined) {
        // Emoji exists in this server
        updateEmojiInDB(client, emoji);
      }
    });
  }
};

/**
 * Update the server emoji usage in the database
 *
 * @param {Discord.Client} client - Discord client connection
 * @param {Discord.Emoji} emoji - The emoji being updated
 */
const updateEmojiInDB = (client, emoji) => {
  const query = `
    UPDATE emote
      SET count = count + 1
      WHERE name = "${emoji.name}"
  `;

  db.query(query, (error, result) => {
    if (error) {
      console.error(`MySQL ${error}`);
      throw error;
    }
    if (result.affectedRows === 0) {
      console.log(
        `Unregistered emoji "${emoji.name}" used; registering now...`,
      );
      const query = `
        INSERT INTO emote (name, emote_id, count)
        VALUES ("${emoji.name}", "${emoji.id}", 1)
      `;
      db.query(query, (error) => {
        if (error) {
          console.error(`MySQL ${error}`);
          throw error;
        }
      });
    }
  });
};
