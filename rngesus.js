const utils = require('./helpers/utils.js');
const Discord = require('discord.js');
const client = new Discord.Client({autoReconnect:true});
const Enmap = require('enmap');
const fs = require('fs');
const config = require('./config.json');
const mysql = require('mysql');

// CLIENT SETUP
client.config = config; // Make config accessible everywhere

// CREATE MYSQL CONNECTION, BIND TO DISCORD CLIENT
client.sqlCon = mysql.createConnection({
    host: config.dbHost,
    user: config.dbUsername,
    password: config.dbPassword,
    database: config.database,
    multipleStatements: true
});

client.sqlCon.connect((error) => {
    if (error) throw error;
    console.log("Connected to MySQL");
});

fs.readdir('./events/', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./events/${file}`);
        let eventName = file.split('.')[0];
        client.on(eventName, event.bind(null, client));
    });
});

client.commands = new Enmap();

fs.readdir('./commands/', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split('.')[0];
        console.log(`Loading command ${commandName}...`);
        client.commands.set(commandName, props);
    });
});


// LOGIN
//client.login(config.production); // production
//client.login(config.testing); // testing
client.login(config.token);

// Event Handlers
client.on('ready', () => {
    console.log('Logged in as ' + client.user.tag);
    // Scan and add new users, emotes to the MySQL database
    utils.scanUsers(client);
    utils.scanEmotes(client);
    client.user.setActivity('God | !info');
});

client.on('error', (error) => {
    console.error(error.message);
});