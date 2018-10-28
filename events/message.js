module.exports = (client, message) => {
    // Ignore bots
    if (message.author.bot) return;

    //if (!message.content.includes(client.config.prefix)) return;
        
    // COMMAND NO ARGS
    if (message.content.includes(client.config.prefix)) {
        // Able to run the command at any location in the string
        const command = message.content.substr(message.content.indexOf(client.config.prefix)+1).split(/ +/g)[0];
    
        // Grab the command data from the client.commands Enmap
        const cmd = client.commands.get(command);

        if (cmd) {
            cmd.run(client, message);
            return;
        }
    }

    // KEK CHECK
    if (message.content.toLowerCase().includes("kek")) {
        const kek = client.commands.get("kek");
        kek.run(client, message);
    }
};