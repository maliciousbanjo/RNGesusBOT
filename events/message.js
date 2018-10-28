module.exports = (client, message) => {
    // Ignore bots
    if (message.author.bot) return;

    if (!message.content.includes(client.config.prefix)) return;

    // Find command and args, if applicable
    
    // This works if no argument
    //const args = message.content.slice(message.content.indexOf(client.config.prefix) + 1).trim().split(/ + /g);

    // this works with arguments but the command must be the first word
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Grab the command data from the client.commands Enmap
    const cmd = client.commands.get(command);

    // If no command, do nothing
    if (!cmd) return;

    // Run the command
    cmd.run(client, message, args);
};