exports.run = (client, message, channel_id) => {
    if (message.author.id !== client.config.ownerId) {
        message.reply("You do not have permission to run this command.");
        return;
    }
    if (channel_id.length === 0) {
        // No channel was specified, grab them all
        message.guild.channels.forEach(channel => {
            if (channel.type !== "text") {
                return;
            }
            console.log(`Scraping ${channel.name}...`);
            scrapeMessages(channel).then(total => {
                console.log(`Processed ${total} messages from ${channel.name}`);
            });
            return;
        });
    } else {
        // Scrape a specified channel
        const channel = client.channels.get(channel_id[0]);
        if (channel == null) {
            message.channel.send("Sorry, I couldn't locate that channel");
            return;
        }
        console.log(`Scraping ${channel.name}...`);
        scrapeMessages(channel).then(total => {
            console.log(`Processed ${total} messages`);
        });
        return;
    }

    async function scrapeMessages(channel) {
        let last_id;
        let total_messages = 0;
        const messageQuery = `INSERT IGNORE INTO message (message_id, author_id, channel_id, epoch) VALUES ?`;
        const emoteCounts = new Map();

        while (true) {
            const messageValues = [];
            const options = { limit: 100 };
            if (last_id) {
                options.before = last_id;
            }

            // Fetch the messages
            const messages = await channel.fetchMessages(options);
            // Process the messages
            messages.forEach(message => {
                total_messages++;
                // Gather message data
                const timestamp = Math.round(message.createdAt.getTime() / 1000);
                const queryValues = [message.id, message.author.id, message.channel.id, timestamp];
                // Add query to bulk query
                messageValues.push(queryValues);

                // Do not gather emote data from bot posts
                if (!message.author.bot) {
                    // Gather emote data
                    const emoteSet = [...new Set(message.content.match(/<:\w*:\d*>/mg))];
                    emoteSet.forEach(identifier => {
                        if (emoteCounts.has(identifier)) {
                            // Increase count
                            emoteCounts.set(identifier, emoteCounts.get(identifier)+1)
                        } else {
                            // Register new emote with initial value of 1
                            emoteCounts.set(identifier, 1);
                        }
                    });
                }
            });

            // Execute query
            client.sqlCon.query(messageQuery, [messageValues], (error, result) => {
                if (error) throw error;
            });
            last_id = messages.last().id;

            if (messages.size < 100) {
                break;
            }
        }
        // Outside the while loop
        // Update final emote totals
        emoteCounts.forEach((count, emoteString) => {
            let emote = client.emojis.find(emoji => emoji.identifier === emoteString.substring(2, emoteString.length - 1));
            if (emote !== null) {
                // Emoji exists in the server
                updateEmote(emote, count);
            }
        });

        return total_messages;
    }

    function updateEmote(emote, count) {
        console.log(`Updating emote "${emote.name}"`);
        const query = `
        UPDATE emote
            SET count = ${count}
            WHERE name = "${emote.name}"
        `;
        // Execute SQL query
        client.sqlCon.query(query, (error, result) => {
            if (error) throw error;
            if (result.affectedRows === 0) {
                console.log(`Unregistered emote "${emote.name}" used; registering now...`);
                const query = `
                    INSERT INTO emote (name, emote_id, count)
                    VALUES ("${emote.name}", "${emote.id}", 1)
                `;
                client.sqlCon.query(query, (error, result) => {
                    if (error) throw error;
                });
            }
        });
    }
}