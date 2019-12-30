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

        // Fetch all the user profiles
        const topUsers = new Array();
        console.log(JSON.stringify(result));

    });
}