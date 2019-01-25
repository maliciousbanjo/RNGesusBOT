module.exports = (client, guildMember) => {
    const disciple = guildMember.guild.roles.find(role => role.name === "Disciple");
    guildMember.addRole(disciple.id);
    const channel = guildMember.guild.channels
        .find(channel => channel.name === client.config.defaultChannel)
        .send(`${guildMember.user.username} was always here.`);
};