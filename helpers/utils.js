function scanUsers(client, serverId) {
  console.log('Scanning users...');
  const guild = client.guilds.cache.get(serverId);
  guild.members.cache.each((guildMember) => {
    addUser(guildMember.user, client);
  });
  console.log('User scan complete.');
}

// TODO: I think this could be a multi-query
function addUser(user, client) {
  const query = `
    INSERT IGNORE INTO user(discord_id, username)
    VALUES ("${user.id}", "${user.username}")
    `;
  console.log(`Adding user ${user.username} to database`);
  client.sqlCon.query(query, (error) => {
    if (error) throw error;
  });
}

// TODO: I think this could be a multi-query. Make this and ScanUsers look similar.
function scanEmotes(client) {
  console.log('Scanning emotes...');
  let query = ``;
  client.emojis.cache.each((emote) => {
    query = `
            INSERT IGNORE INTO emote (name, emote_id)
            VALUES ("${emote.name}", "${emote.id}")
        `;
    console.log(`Adding emote ${emote.name} to database`);
    client.sqlCon.query(query, (error) => {
      if (error) throw error;
    });
  });
  console.log('Emote scan complete');
}

module.exports.scanUsers = scanUsers;
module.exports.addUser = addUser;
module.exports.scanEmotes = scanEmotes;
