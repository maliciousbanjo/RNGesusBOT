const mongo = require('mongodb');
module.exports = (client, message) => {
    // Ignore bots
    if (message.author.bot) return;

    // Process the message, parse out relevant metrics
    const MongoClient = mongo.MongoClient;
    console.log("Connecting to MongoDB...");
    MongoClient.connect(client.config.databaseURL, {useNewUrlParser: true}, (error, client) => {
        if (error) throw error;
        console.log("Connected to MongoDB")
        const db = client.db("test");

        // Update the user's information. Will create new Document if it doesn't already exist
        db.collection("users").updateOne(
            // Discord User ID
            { discord_id: message.author.id },
            {
                // Set username and avatar photo
                $set: {
                    username: message.author.username,
                },
                // Increment message count by 1. If field doesn't exist will instantiate at 1.
                $inc: {
                    messages: 1
                }
            },
            { upsert: true },
            (error, result) => {
                if (error) throw error;
                console.log("User Document Updated");
                client.close();
            }
        );
    });
    
    // COMMAND WITH ARGS
    if (message.content.indexOf(client.config.prefix) === 0) {
        console.log('Command with args');

        const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        const cmd = client.commands.get(command);

        if (cmd) {
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