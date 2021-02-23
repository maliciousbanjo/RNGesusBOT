// TODO ?

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

  // Golden: 6%
  // Platelet: 4%

  let chance = Math.floor(Math.random() * Math.floor(100)); // Golden kek

  if (chance < 90) {
    // do nothing
  } else if (chance >= 90 && chance < 96) {
    // golden kek
    console.log(`${message.author.username} has received the Golden Kek`);
    //message.reply("https://gfycat.com/jollyuglyape"); // Christmas Kek
    const kekImageUrl =
      client.config.goldenImages[
        Math.floor(Math.random() * client.config.goldenImages.length)
      ];
    message.reply(kekImageUrl);
    goldenKekUpdate();
    return;
  } else if (chance >= 96) {
    // platelet
    console.log(
      `${message.author.username} has had their kek stolen by a platelet!`,
    );
    message.reply('https://i.imgur.com/izO82MU.png');
    plateletKekUpdate();
    return;
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
      const golden_kek_count = result[0].golden_count;
      // Update the 'user' table
      const userQuery = `
        UPDATE user
          SET golden_count = golden_count - 1
        WHERE (discord_id = "${message.author.id}")
      `;
      client.sqlCon.query(userQuery, (error, result, fields) => {
        if (error) throw error;
        message.reply(
          'Your golden kek has been stolen by a platelet!' +
            `\nYour Golden Kek count is now ${golden_kek_count - 1}`,
        );
      });
    });
    return;
  }
};
