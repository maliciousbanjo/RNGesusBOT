// This one might not be necessary, just add this code to the client startup?
function scanUsers(client) {
    console.log('Scanning users...');
    client.users.forEach(user => {
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

function formatDate(date) {
    const monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return `${monthNames[monthIndex]} ${day}, ${year}`;
}
module.exports.scanUsers = scanUsers;
module.exports.addUser = addUser;
module.exports.scanEmotes = scanEmotes;
module.exports.formatDate = formatDate;