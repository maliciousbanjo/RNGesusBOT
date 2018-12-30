const mongo = require('mongodb');
exports.run = (client, message) => {
    let chance = Math.floor(Math.random() * client.config.goldenRate); // Golden kek
    let goldenKek = false;
    if (chance == 0) {
        goldenKek = true;
        console.log(`${message.author.username} has received the Golden Kek`);
        message.reply("http://i.imgur.com/Qvpx2KK.png"); // Golden Kek
        updateKek("golden_kek");
    }
    if (!goldenKek) {
        chance = Math.floor(Math.random() * client.config.cosmicRate); // Cosmic kek
        if (chance == 0) {
            console.log(`${message.author.username} has received the Cosmic Kek`);
            message.reply("http://i.imgur.com/MJ4QnXr.jpg");
            updateKek("cosmic_kek");
        }
    }

    // TODO: Update the Server collection as well, for "Most Recent" kek holder
    /**
     * Update the user's Golden/Cosmic kek count in MongoDB
     * @param {String} kekType The type of kek to update, Golden or Cosmic
     */
    function updateKek(kekType) {
        const MongoClient = mongo.MongoClient;
        MongoClient.connect(client.config.databaseURL, {useNewUrlParser: true}, (error, mongoClient) => {
            if (error) {
                console.error(error);
                return;
            }
            const db = mongoClient.db(client.config.database);

            // Update the user's kek count
            db.collection('users').updateOne(
                // Discord User ID
                { discord_id: message.author.id },
                {
                    // Increment kek count by one. If field doesn't exist it will instantiate at 1.
                    $inc: {
                        [kekType]: 1
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
}