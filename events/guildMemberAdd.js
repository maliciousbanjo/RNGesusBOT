module.exports = (client, guildMember) => {
    // Add the new user to the default role of "Disciple"
    const disciple = guildMember.guild.roles.find(role => role.name === "Disciple");
    guildMember.addRole(disciple.id);
    console.log(`${guildMember.user.username} has joined the server.`);
    const channel = guildMember.guild.channels
        .find(channel => channel.id === client.config.defaultChannelId)
        .send(`${guildMember.user.username} has joined the Church!`);
    return;
};