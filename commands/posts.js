const Discord = require('discord.js');
exports.run = (client, message) => {
    const query = `
    SELECT user.*, count(message.author_id) AS 'message_count' 
    FROM message LEFT JOIN user 
        ON user.discord_id=message.author_id 
    WHERE username!='RNGesus' 
    GROUP BY discord_id 
    ORDER BY message_count 
    DESC LIMIT 10
    `;

    client.sqlCon.query(query, (error, result) => {
        if (error) throw error;
        if (result.length === 0) {
            message.channel.send("There are no recorded messages");
            return;
        }

        // Format ranking strings
        let userString = ``;
        for (i = 0; i < result.length; i++) {
            // Fetch the user profile from Discord
            const user = message.guild.members.find(user => user.id === result[i].discord_id);
            userString += `${i+1}. ${user}: ${result[i].message_count.toLocaleString()}\n`;
        }

        // Build the RichEmbed
        const richEmbed = new Discord.RichEmbed()
            .setColor('BLUE')
            .setTitle(`Top Posters in ${message.guild.name}`)
            .setThumbnail(message.guild.iconURL)
            .addField('Users', userString);
        
        message.channel.send(richEmbed);
    });
}