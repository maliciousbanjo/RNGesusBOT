const Discord = require('discord.js');
exports.run = (client, message, args) => {

    //let userId = args[0].match(/\d+/g)[0]; // Process UserID out of args array
    const numMatch = new RegExp(/\d+/);
    if(numMatch.test(args[0])) {
        const userId = numMatch.exec(args[0])[0];

        // Find user ID
        const targetUser = message.guild.members.find(user => user.id === userId);
        const richEmbed = new Discord.RichEmbed()
            .setColor(3447003)
            .setAuthor(targetUser.displayName, targetUser.user.avatarURL)
            .setThumbnail(targetUser.user.avatarURL)
            .addField("Role", targetUser.highestRole.name)
            .addField("User Since", new Date(targetUser.user.createdAt).toDateString())
            .addField("Joined Server", new Date(targetUser.joinedAt).toDateString());

        message.channel.send(richEmbed);
    } else {
        message.channel.send("Sorry, I couldn't find that user");
    }
}