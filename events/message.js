module.exports = (client, message) => {
    // Ignore bots and testing channel
    if (message.author.bot) return;

    // USER MESSAGE COUNT
    if (message.channel.name != "bot_test") { // Test messages don't count
        updateMessage(message);
    }
    
    // SCAN MESSAGE FOR CUSTOM EMOTES
    if (message.content.includes('<:')) {
        const emoteName = message.content.match(/\:(.*?)\:/)[1]; // Parse out emote
        const emote = client.emojis.find(emoji => emoji.name === emoteName);
        const disciple = message.guild.roles.find(role => role.name === "Disciple");
        if (emote !== null) {
            // Emoji exists in this server
            console.log(`Updating emote ${emote.name}`);
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
        INSERT INTO EMOTE (name, server_id, emote_id, image_url, count)
        VALUES ("${emote.name}", "${message.guild.id}", "${emote.id}", "${emote.url}", 1)
        ON DUPLICATE KEY UPDATE
            count = count + 1
        `;
        client.sqlCon.query(query, (error, result) => {
            if (error) throw error;
            // console.log(`${result.affectedRows} EMOTE record(s) updated`);
        });
    }

    /**
     * Update the message counter of a message's author
     * @param {Discord.Message} message Message being processed for information
     */
    function updateMessage(message) {
        const query = `
        INSERT INTO USER (discord_id, username, messages, golden_kek, cosmic_kek)
        VALUES ("${message.author.id}", "${message.author.username}", 1, 0, 0)
        ON DUPLICATE KEY UPDATE
            messages = messages + 1
        `;
        client.sqlCon.query(query, (error, result) => {
            if (error) throw error;
            // console.log(`${result.affectedRows} USER record(s) updated`);
        });
    }
};