exports.run = (client, message, args) => {
    const muff1 = client.emojis.find(emoji => emoji.name === "muff1");
    const muff2 = client.emojis.find(emoji => emoji.name === "muff2");
    const muff3 = client.emojis.find(emoji => emoji.name === "muff3");
    const muff4 = client.emojis.find(emoji => emoji.name === "muff4");

    message.channel.send(`${muff2}${muff1}\n${muff3}${muff4}`);
}