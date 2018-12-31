exports.run = (client, message) => {
    let chance = Math.floor(Math.random() * client.config.goldenRate); // Golden kek
    let goldenKek = false;
    if (chance == 0) {
        goldenKek = true;
        console.log(`${message.author.username} has received the Golden Kek`);
        message.reply("http://i.imgur.com/Qvpx2KK.png"); // Golden Kek
        updateKek("golden_kek");
    }
    if (!goldenKek) {
        chance = Math.floor(Math.random() * client.config.cosmicRate); // Cosmic kek
        if (chance == 0) {
            console.log(`${message.author.username} has received the Cosmic Kek`);
            message.reply("http://i.imgur.com/MJ4QnXr.jpg");
            updateKek("cosmic_kek");
        }
    }

    /**
     * Update the user's kekcount and the most recent kek in MySQL
     * @param {String} kekType 
     */
    function updateKek(kekType) {
        const userQuery = `
            UPDATE USER
                SET ${[kekType]} = ${[kekType]} + 1
            WHERE (discord_id = "${message.author.id}")
        `;
        client.sqlCon.query(userQuery, (error, result) => {
            if (error) throw error;
            console.log(`${result.affectedRows} USER record(s) updated`);
        });

        let serverQuery;
        if (kekType === "golden_kek") {
            serverQuery = `
                UPDATE SERVER
                SET
                    last_golden_user = "${message.author.id}",
                    golden_timestamp = ${message.createdTimestamp}
            `;
            client.sqlCon.query(serverQuery, (error, result) => {
                if (error) throw error;
                console.log(`${result.affectedRows} SERVER record(s) updated`);
            });
        } else { // cosmic_kek
            serverQuery = `
                UPDATE SERVER
                SET
                    last_cosmic_user = "${message.author.id}",
                    cosmic_timestamp = ${message.createdTimestamp}
            `;
            client.sqlCon.query(serverQuery, (error, result) => {
                if (error) throw error;
                console.log(`${result.affectedRows} SERVER record(s) updated`);
            });
        }
    }
}