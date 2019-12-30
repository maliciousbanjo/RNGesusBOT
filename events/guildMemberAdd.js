const utils = require('./../helpers/utils.js');
module.exports = (client, guildMember) => {
    // Add the new user to the default role of "Disciple"
    const disciple = guildMember.guild.roles.find(role => role.name === "Disciple");
    guildMember.addRole(disciple.id);
    console.log(`${guildMember.user.username} has joined the server.`);

    // Add the user to the MySQL database
    utils.addUser(guildMember.user, client);
    
    const channel = guildMember.guild.channels
        .find(channel => channel.id === client.config.defaultChannelId)
        .send(`${guildMember.user.username} has joined the Church!`);
    return;
};