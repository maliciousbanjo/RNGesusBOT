module.exports = (client, guildMember) => {
    const disciple = guildMember.guild.roles.find(role => role.name === "Disciple");

    // If it's the owner, don't actually add the role
    if (guildMember.user.id === client.config.ownerId) {
        const channel = guildMember.guild.channels
            .find(channel => channel.name === client.config.defaultChannel)
            .send(`${guildMember.user.username} was always here.`);
        return;
    }
    // Add the new user to the default role of "Disciple"
    guildMember.addRole(disciple.id);
    console.log(`${guildMember.user.username} has joined the server.`);
    const channel = guildMember.guild.channels
        .find(channel => channel.name === client.config.defaultChannel)
        .send(`${guildMember.user.username} was always here.`);
    return;
};