exports.run = (client, message) => {
    let chance = Math.floor(Math.random() * client.config.goldenRate); // Golden kek
    let goldenKek = false;
    if (chance == 0) {
        goldenKek = true;
        console.log(`${message.author.username} has received the Golden Kek`);
        message.reply("http://i.imgur.com/Qvpx2KK.png"); // Golden Kek
    }
    if (!goldenKek) {
        chance = Math.floor(Math.random() * client.config.cosmicRate); // Cosmic kek
        if (chance == 0) {
            console.log(`${message.author.username} has received the Cosmic Kek`);
            message.reply("http://i.imgur.com/MJ4QnXr.jpg");
        }
    }
}