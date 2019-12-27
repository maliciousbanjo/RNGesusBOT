// This one might not be necessary, just add this code to the client startup?
function scanUsers(client) {
    console.log('Scanning users...');
    client.users.forEach(user => {
        if (user.bot) {
            // Do not add a bot
            return;
        }
        addUser(user, client); 
    });
    console.log('User scan complete.');
}

function addUser(user, client) {
    const query = `
    INSERT IGNORE INTO user(discord_id, username)
    VALUES ("${user.id}", "${user.username}")
    `;
    console.log(`Adding user ${user.username} to database...`);
    client.sqlCon.query(query, (error, result) => {
        if (error) throw error;
    });
}

function scanEmotes(client) {
    console.log("Scanning emotes...");
    let query = ``;
    client.emojis.forEach(emote => {
        console.log(emote.identifier.toString());
        query = `
            INSERT IGNORE INTO emote (name, emote_id)
            VALUES ("${emote.name}", "${emote.id}")
        `;
        client.sqlCon.query(query, (error, result) => {
            if (error) throw error;
        });
    });
    console.log("Emote scan complete");
}
module.exports.scanUsers = scanUsers;
module.exports.addUser = addUser;
module.exports.scanEmotes = scanEmotes;