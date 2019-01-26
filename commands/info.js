const Discord = require('discord.js');

exports.run = (client, message, args) => {
    const richEmbed = new Discord.RichEmbed()
      .setColor(3447003)
      .setAuthor(client.user.username, client.user.avatarURL)
      .setTitle('Click to View Repository')
      .setURL('https://github.com/maliciousbanjo/RNGesusBOT')
      .setDescription('Chaos is order, all hail the random.')
      .addField('Commands', '!roll - Roll a 20-sided die\n' +
        '!muff - Muffin face multi-emote\n' +
        '!ffum - Inverted Muffin face multi-emote\n' + 
        '!user <@username> - User info. Must @ tag a valid username\n' +
        '!server - Server info\n' +
        '!emotes - Top 5 Emotes');
    message.channel.send(richEmbed);
}