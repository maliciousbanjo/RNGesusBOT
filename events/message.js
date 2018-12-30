const mongo = require('mongodb');
module.exports = (client, message) => {
    // Ignore bots
    if (message.author.bot) return;

    // USER MESSAGE COUNT
    updateMessageCount(message);
    
    // SCAN MESSAGE FOR CUSTOM EMOTES
    if (message.content.includes('<:')) {
        const emoteName = message.content.match(/\:(.*?)\:/)[1]; // Parse out emote
        const emote = client.emojis.find(emoji => emoji.name === emoteName);
        if (emote !== null) {
            // Emoji exists in this server
            console.log(`Updating emote ${emote.name}`);
            updateEmoteCount(emote);
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
     * Update the global emoji usage
     * @param {Discord.Emoji} emote The emoji being updated
     */
    function updateEmoteCount(emote) {
        const MongoClient = mongo.MongoClient;
        MongoClient.connect(client.config.databaseURL, {useNewUrlParser: true}, (error, mongoClient) => {
            if (error) {
                console.error(error);
                return;
            }
            const db = mongoClient.db(client.config.database);
    
            // Update the user's information. Will create new Document if it doesn't already exist
            db.collection('emotes').updateOne(
                // Discord User ID
                { name: emote.name },
                {
                    // Set username and avatar photo
                    $set: {
                        emote_id: emote.id,
                        url: emote.url
                    },
                    // Increment message count by 1. If field doesn't exist it will instantiate at 1.
                    $inc: {
                        count: 1
                    }
                },
                { upsert: true },
                (error, result) => {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    mongoClient.close();
                }
            );
        });
    }

    /**
     * Update the message counter of a message's author
     * @param {Discord.Message} message Message being processed for information
     */
    function updateMessageCount(message) {
        const MongoClient = mongo.MongoClient;
        MongoClient.connect(client.config.databaseURL, {useNewUrlParser: true}, (error, mongoClient) => {
            if (error) {
                console.error(error);
                return;
            }
            const db = mongoClient.db(client.config.database);
    
            // Update the user's information. Will create new Document if it doesn't already exist
            db.collection('users').updateOne(
                // Discord User ID
                { discord_id: message.author.id },
                {
                    // Set username and avatar photo
                    $set: {
                        username: message.author.username,
                    },
                    // Increment message count by 1. If field doesn't exist it will instantiate at 1.
                    $inc: {
                        messages: 1
                    }
                },
                { upsert: true },
                (error, result) => {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    mongoClient.close();
                }
            );
        });
    }
};