module.exports = (client, message) => {
    // Ignore bots and testing channel
    if (message.author.bot) return;

    // USER MESSAGE COUNT
    // TODO: this should be a configurable array of channel IDs to ignore
    if (message.channel.id != "526091649667956745") { // Test messages don't count
        addMessage(message);
    }
    
    // SCAN MESSAGE FOR CUSTOM EMOTES
    if (message.content.includes('<:')) {
        const emoteName = message.content.match(/\:(.*?)\:/)[1]; // Parse out emote
        const emote = client.emojis.find(emoji => emoji.name === emoteName);
        if (emote !== null) {
            // Emoji exists in this server
            updateEmote(emote, message);
        }
    }

    // COMMAND WITH ARGS
    if (message.content.indexOf(client.config.prefix) === 0) {
        const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        const cmd = client.commands.get(command);

        if (cmd) {
            console.log(`Running ${command}`);
            cmd.run(client, message, args);
            return;
        }
    }

    // COMMAND NO ARGS
    if (message.content.includes(client.config.prefix)) {
        // Able to run the command at any location in the string
        const command = message.content.substr(message.content.indexOf(client.config.prefix)+1).split(/ +/g)[0];
    
        // Grab the command data from the client.commands Enmap
        const cmd = client.commands.get(command);

        if (cmd) {
            console.log(`Running ${command}`);
            cmd.run(client, message);
            return;
        }
    }

    // KEK CHECK
    if (message.content.toLowerCase().includes('kek')) {
        const kek = client.commands.get('kek');
        kek.run(client, message);
    }

    /**
     * Update the server emote usage
     * @param {Discord.Emoji} emote  The emote being updated
     */
    function updateEmote(emote) {
        const query = `
        INSERT INTO emote (name, emote_id, image_url, count)
        VALUES ("${emote.name}", "${emote.id}", "${emote.url}", 1)
        ON DUPLICATE KEY UPDATE
            count = count + 1
        `;
        client.sqlCon.query(query, (error, result) => {
            if (error) throw error;
        });
    }


    /**
     * Insert a record of a new message
     * @param {Discord.Message} message Message being processed
     */
    function addMessage(message) {
        const query = `
        INSERT INTO message (message_id, author_id, channel_id)
        VALUES ("${message.id}", "${message.author.id}", "${message.channel.id}")
        `;

        client.sqlCon.query(query, (error, result) => {
            if (error) throw error;
        });
    }
};