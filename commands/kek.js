exports.run = (client, message) => {
    let chance = Math.floor(Math.random() * client.config.goldenRate); // Golden kek
    let goldenKek = false;
    let plateletKek = false;
    if (chance == 0) {
        goldenKek = true;
        console.log(`${message.author.username} has received the Golden Kek`);
        message.reply("http://i.imgur.com/Qvpx2KK.png"); // Golden Kek
        goldenKekUpdate();
        return;
    }
    if (!goldenKek) {
        chance = Math.floor(Math.random() * client.config.plateRate); // Platelet kek
        if (chance == 0) {
            console.log(`${message.author.username} has had their kek stolen by a platelet!`);
            message.reply("https://i.imgur.com/izO82MU.png");
            plateletKekUpdate();
            return;
        }
    }
    if (!goldenKek && !plateletKek) {
        chance = Math.floor(Math.random() * client.config.cosmicRate); // Cosmic kek
        if (chance == 0) {
            console.log(`${message.author.username} has received the Cosmic Kek`);
            message.reply("http://i.imgur.com/MJ4QnXr.jpg");
            cosmicKekUpdate();
            return;
        }
    }

    /**
     * DEPRECATED
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
            // console.log(`${result.affectedRows} USER record(s) updated`);
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
                // console.log(`${result.affectedRows} SERVER record(s) updated`);
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
                // console.log(`${result.affectedRows} SERVER record(s) updated`);
            });
        }
    }

    /**
     * Update the user's golden kek count and the most recent server kek in MySQL
     */
    function goldenKekUpdate() {
        // Update the USER table
        const userQuery = `
            UPDATE USER
                SET golden_kek = golden_kek + 1
            WHERE (discord_id = "${message.author.id}")
        `;
        client.sqlCon.query(userQuery, (error, result) => {
            if (error) throw error;
        });

        // Update the SERVER table
        const serverQuery = `
            UPDATE SERVER
            SET
                last_golden_user = "${message.author.id}",
                golden_timestamp = ${message.createdTimestamp}
        `;
        client.sqlCon.query(serverQuery, (error, result) => {
            if (error) throw error;
        });
        return;
    }

    /**
     * Update the user's cosmic kek count and the most recent server kek in MySQL
     */
    function cosmicKekUpdate() {
        // Update the USER table
        const userQuery = `
            UPDATE USER
                SET cosmic_kek = cosmic_kek + 1
            WHERE (discord_id = "${message.author.id}")
        `;
        client.sqlCon.query(userQuery, (error, result) => {
            if (error) throw error;
        });
        const serverQuery = `
            UPDATE SERVER
            SET
                last_cosmic_user = "${message.author.id}",
                cosmic_timestamp = ${message.createdTimestamp}
        `;
        client.sqlCon.query(serverQuery, (error, result) => {
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
            SELECT golden_kek FROM USER
            WHERE discord_id = "${message.author.id}"
        `;
        client.sqlCon.query(query, (error, result, fields) => {
            if (error) throw error;
            if (result[0].golden_kek !== 0) {
                const golden_kek_count = result[0].golden_kek;
                // Update the USER table
                const userQuery = `
                    UPDATE USER
                        SET golden_kek = golden_kek - 1
                    WHERE (discord_id = "${message.author.id}")
                `;
                client.sqlCon.query(userQuery, (error, result, fields) => {
                    if (error) throw error;
                    message.reply("Your golden kek has been stolen by a platelet!"+
                    `\nYour Golden Kek count is now ${golden_kek_count}`)
                });
            } else {
                message.reply("Your golden kek has been stolen by a platelet!")
            }
        });
        return;
    }
}