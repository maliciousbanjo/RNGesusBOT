exports.run = (client, message, args) => {
/**
 * No arguments yet
 * Return the user info of the command invoker
 * Eventually will receive a user object to return anyone's info
 */
    // client.users.forEach((user, id) => {
    //     if (!user.bot) {
    //         message.channel.send(user.toString());
    //     }
    // });
    roles = message.member.roles.filter((role) => {
        if (role.name != '@everyone') {
            return role.name;
        }
    });

    roles = Array.from(message.member.roles.values()).filter((role) => {
        if (role.name != '@everyone') {
            return role.name;
        }
    });

    console.log(roles);

    const embed = {
        embed: {
            color: 3447003,
            author: {
                name: message.author.username,
                icon_url: message.author.avatarURL
            },
            fields: [{
                name: "Roles",
                value: "Kek"
            }]
        }
    };

    message.channel.send(embed);

    // client.emojis.forEach((emoji, id) => {
    //     message.channel.send(id + " " + emoji)
    // });
}