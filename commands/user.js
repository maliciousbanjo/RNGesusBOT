const mongo = require('mongodb');
const Discord = require('discord.js');
exports.run = (client, message, args) => {
    const numMatch = new RegExp(/\d+/);
    if(numMatch.test(args[0])) {
        // Process UserID out of args array
        const userId = numMatch.exec(args[0])[0];

        // Query for the Discord User in MongoDB
        const MongoClient = mongo.MongoClient;
        MongoClient.connect(client.config.databaseURL, {useNewUrlParser: true}, (error, mongoClient) => {
            if (error) {
                console.error(error);
                return;
            }
            const db = mongoClient.db(client.config.database);

            // Fetch the user's document
            db.collection('users').findOne({ discord_id: message.author.id }, (error, result) => {
                if (error) {
                    console.error(error);
                    return;
                }
                // Find user ID
                const targetUser = message.guild.members.find(user => user.id === userId);
                const richEmbed = new Discord.RichEmbed()
                    .setColor(3447003)
                    .setAuthor(targetUser.displayName, targetUser.user.avatarURL)
                    .setThumbnail(targetUser.user.avatarURL)
                    .addField('Role', targetUser.highestRole.name)
                    .addField('User Since', new Date(targetUser.user.createdAt).toDateString())
                    .addField('Joined Server', new Date(targetUser.joinedAt).toDateString())
                    .addField('Messages', result.messages);
                if (result.golden_kek !== 0) {
                    richEmbed.addField('Golden Keks', result.golden_kek)

                }
                if (result.cosmic_kek !== 0) {
                    richEmbed.addField('Cosmic Keks', result.cosmic_kek);
                }

                message.channel.send(richEmbed);
            });
        });

    } else {
        message.channel.send(`Sorry, I couldn't find that user`);
    }
}