const Discord = require('discord.js');
const packageJson = require('../package.json');

exports.run = (client, message, args) => {
    const richEmbed = new Discord.RichEmbed()
      .setColor('BLUE')
      .setThumbnail(client.user.avatarURL)
      .setTitle(client.user.username)
      .setFooter(`Version ${packageJson.version}`)
      .setURL('https://github.com/maliciousbanjo/RNGesusBOT')
      .addField('Commands', '`!roll` - Roll a 20-sided die\n' +
        '`!muff` - Muffin face multi-emote\n' +
        '`!ffum` - Inverted Muffin face multi-emote\n' + 
        '`!user <@username>` - User info. Must @ tag a valid username\n' +
        '`!server` - Server info\n' +
        '`!emotes` - Top 10 Emotes\n' +
        '`!quote <message id>` - Quote a previous message');
    message.channel.send(richEmbed);
}