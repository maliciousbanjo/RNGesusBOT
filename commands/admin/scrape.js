const Discord = require('discord.js');
const dbUtils = require('../../helpers/databaseUtils');
const db = dbUtils.getDbConnection();

module.exports = {
  /**Command name */
  name: 'scrape',
  /**Command description */
  description:
    'Scrape a channel of all messages and add the info to the database. ' +
    'Will scrape all channels if a channel ID is not provided',
  /**Command usage example */
  usage: '*<channel ID>',
  category: 'Admin',
  admin: true,
  /**
   * Scrape a channel of all messages and add the info to the database.
   * Will scrape all channels if a channel ID is not provided.
   *
   * @param {Discord.Message} message - Message to process
   * @param {Array<string>} channel_id - Channel ID to scrape
   */
  run: (message, channel_id = []) => {
    if (channel_id === undefined || channel_id.length === 0) {
      // No channel was specified; grab them all
      message.guild.channels.cache.each((guildChannel) => {
        if (guildChannel.type !== 'text') {
          // only gather messages from text channels
          return;
        }
        console.log(`Scraping channel "${guildChannel.name}"`);
        message.reply(`Scraping channel ${guildChannel}`);
        scrapeMessages(guildChannel).then((total) => {
          console.log(
            `Processed ${total} messages from "${guildChannel.name}"`,
          );
          message.reply(`Processed ${total} messages from ${guildChannel}`);
        });
        return;
      });
    } else {
      // Scrape a specified channel
      const guildChannel = message.guild.channels.cache.get(channel_id[0]);
      if (guildChannel === undefined) {
        message.channel.send("Sorry, I couldn't locate that channel");
        return;
      }
      if (guildChannel.type !== 'text') {
        message.reply('Only text channels can be processed.');
        return;
      }
      console.log(`Scraping channel "${guildChannel.name}"`);
      message.reply(`Scraping channel ${guildChannel}`);
      scrapeMessages(guildChannel).then((total) => {
        console.log(`Processed ${total} messages from "${guildChannel.name}"`);
        message.reply(`Processed ${total} messages from ${guildChannel}`);
      });
      return;
    }
  },
};

/**
 * Scrape a text channel for messages. Process messages for author, channel, and emoji.
 *
 * @param {Discord.TextChannel} channel - Channel to scrape
 * @returns {number} Total messages scraped
 */
async function scrapeMessages(channel) {
  let lastMessageId;
  let totalMessages = 0;
  let continueLooping = true; // Infinite loop flag
  const messageQuery = `INSERT IGNORE INTO message (message_id, author_id, channel_id, epoch, has_kek) VALUES ?`;
  const emojiCounts = new Map();

  while (continueLooping) {
    const messageValues = [];
    const options = { limit: 100 };
    if (lastMessageId) {
      options.before = lastMessageId;
    }

    // Fetch the messages
    const messages = await channel.messages.fetch(options);

    // Process the messages
    messages.forEach((message) => {
      let hasKek = false;
      totalMessages++;
      // Gather message data
      const timestamp = Math.round(message.createdAt.getTime() / 1000);
      if (message.content.toLowerCase().includes('kek')) {
        hasKek = true;
      }
      const queryValues = [
        message.id,
        message.author.id,
        message.channel.id,
        timestamp,
        hasKek,
      ];
      // Add query to bulk query
      messageValues.push(queryValues);

      // Do not gather emoji data from bot posts
      if (!message.author.bot) {
        // Gather emoji data
        const emoji = [...new Set(message.content.match(/<:\w*:\d*>/gm))];
        emoji.forEach((identifier) => {
          if (emojiCounts.has(identifier)) {
            // Increase count
            emojiCounts.set(identifier, emojiCounts.get(identifier) + 1);
          } else {
            // Register new emoji with initial value of 1
            emojiCounts.set(identifier, 1);
          }
        });
      }
    });

    // Execute query
    if (messageValues.length !== 0) {
      db.query(messageQuery, [messageValues], (error) => {
        if (error) {
          console.error(`MySQL ${error}`);
          throw error;
        }
      });
    }

    lastMessageId = messages.last().id;

    if (messages.size < 100) {
      continueLooping = false;
    }
  }

  // Outside the while loop
  // Update final emoji totals
  emojiCounts.forEach((count, emojiString) => {
    const emojiName = emojiString.match(/:(.*?):/)[1]; // Parse out emoji
    let emoji = channel.guild.emojis.cache.find(
      (emoji) => emoji.name === emojiName,
    );
    if (emoji !== undefined) {
      // Emoji exists in the server
      updateEmoji(emoji, count);
    }
  });

  return totalMessages;
}

/**
 * Insert an emoji and its usage count into the database.
 *
 * @param {Discord.Emoji} emoji - Emoji to insert into the database
 * @param {number} count - Number of times the emoji has been used
 */
function updateEmoji(emoji, count) {
  console.log(`Updating emoji "${emoji.name}"`);
  const query = `
    UPDATE emote
      SET count = count + ${count}
      WHERE name = "${emoji.name}"
  `;
  // Execute SQL query
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
}
