exports.run = (client, message) => {
    // Increase kek count regardless of result
    const query = `
        UPDATE user
            SET kek_count = kek_count + 1
        WHERE (discord_id = "${message.author.id}")
    `;
    client.sqlCon.query(query, (error, result) => {
        if (error) throw error;
    });

    let chance = Math.floor(Math.random() * client.config.goldenRate); // Golden kek
    let goldenKek = false;

    if (chance == 0) { // Golden kek acheived
        goldenKek = true;
        chance = Math.floor(Math.random() * client.config.plateRate); // Platelet kek
        if (chance == 0) { // Platelet kek steals the golden kek
            console.log(`${message.author.username} has had their kek stolen by a platelet!`);
            message.reply("https://i.imgur.com/izO82MU.png");
            plateletKekUpdate();
            return;
        } else { // Normal golden kek
            console.log(`${message.author.username} has received the Golden Kek`);
            message.reply("https://gfycat.com/jollyuglyape"); // Christmas Kek
            // const kekImageUrl = client.config.goldenImages[Math.floor(Math.random()*client.config.goldenImages.length)];
            // message.reply(kekImageUrl)
            goldenKekUpdate();
            return;
        }
    }
    
    /**
     * Update the user's golden kek count and the most recent server kek in MySQL
     */
    function goldenKekUpdate() {
        // Update the 'user' table
        const userQuery = `
            UPDATE user
                SET golden_count = golden_count + 1
            WHERE (discord_id = "${message.author.id}")
        `;
        client.sqlCon.query(userQuery, (error, result) => {
            if (error) throw error;
        });
        return;
    }

    /**
     * @deprecated as of version 2.7.0
     * Update the user's cosmic kek count and the most recent server kek in MySQL
     */
    function cosmicKekUpdate() {
        // Update the 'user' table
        const userQuery = `
            UPDATE user
                SET cosmic_count = cosmic_count + 1
            WHERE (discord_id = "${message.author.id}")
        `;
        client.sqlCon.query(userQuery, (error, result) => {
            if (error) throw error;
        });
        return;
    }

    /**
     * Decrease the user's golden kek count
     */
    function plateletKekUpdate() {
        // Query the user's kek count
        const query = `
            SELECT golden_count FROM user
            WHERE discord_id = "${message.author.id}"
        `;
        client.sqlCon.query(query, (error, result, fields) => {
            if (error) throw error;
            if (result[0].golden_count !== 0) {
                const golden_kek_count = result[0].golden_count;
                // Update the 'user' table
                const userQuery = `
                    UPDATE user
                        SET golden_count = golden_count - 1
                    WHERE (discord_id = "${message.author.id}")
                `;
                client.sqlCon.query(userQuery, (error, result, fields) => {
                    if (error) throw error;
                    message.reply("Your golden kek has been stolen by a platelet!"+
                    `\nYour Golden Kek count is now ${golden_kek_count - 1}`)
                });
            } else {
                message.reply("Your golden kek has been stolen by a platelet!")
            }
        });
        return;
    }
}