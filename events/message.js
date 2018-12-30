const mongo = require('mongodb');
module.exports = (client, message) => {
    // Ignore bots
    if (message.author.bot) return;

    // USER MESSAGE COUNT
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
};