exports.run = (client, message, args) => {
    const embed = {embed: {
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title: "Link to GitHub",
        url: "https://github.com/maliciousbanjo/RNGesusBOT",
        description: "Chaos is order, all hail the random.",
        fields: [{
            name: "Commands",
            value: "!roll - Roll a 20-sided die\n" +
            "!muff - Muffin face multi-emote\n" +
            "!ffum - Inverted Muffin face multi-emote\n"
          },
        ],
      }
    };
    message.channel.send(embed);
}