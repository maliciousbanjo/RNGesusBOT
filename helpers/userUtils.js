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
module.exports.scanUsers = scanUsers;
module.exports.addUser = addUser;