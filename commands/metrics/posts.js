const Discord = require('discord.js');
const QuickChart = require('quickchart-js');
const dbUtils = require('../../helpers/databaseUtils');
const db = dbUtils.getDbConnection();

module.exports = {
  /**Command name */
  name: 'posts',
  /**Command description */
  description: 'List the top 10 posters in the server.',
  /**Command usage example */
  usage: '*<user>',
  category: 'Metrics',
  /**
   * List the top 10 posters in the server.
   *
   * @param {Discord.Message} message - Message to process
   */
  run: (message) => {
    // No user was tagged; list the top 10 posters
    const query = `
      SELECT user.username, user.discord_id, count(message.author_id) AS 'message_count' 
      FROM message LEFT JOIN user 
          ON user.discord_id=message.author_id 
      GROUP BY discord_id 
      ORDER BY message_count 
      DESC LIMIT 10
    `;
    // Make sure to put this back above "GROUP BY"
    //      WHERE user.discord_id!='${message.client.user.id}'


    db.query(query, (error, result) => {
      if (error) {
        console.error(`MySQL ${error}`);
        throw error;
      }
      if (result.length === 0) {
        message.channel.send('There are no recorded messages');
        return;
      }

      const chart = new QuickChart();
      chart.setConfig({
        type: 'horizontalBar',
        data: {
          labels: [result[0].username, result[1].username],
          datasets: [{
            //label: 'Other Joe',
            data: [result[0].message_count, result[1].message_count],
            maxBarThickness: 5
          }]
        },
        options: {
          scales: {
            xAxes: [{
              ticks: {
                beginAtZero: true,
                callback: (value) => { if (value % 1 === 0 ) {return value;}}
              }
            }],
          }
        }
      });
  
      const chartEmbed = new Discord.MessageEmbed()
      .setTitle("Joe Chart")
      .setDescription("This is a chart")
      .setImage(chart.getUrl());
  
      message.channel.send(chartEmbed);

      // // Format ranking strings
      // let memberStr = ``;
      // for (let i = 0; i < result.length; i++) {
      //   // Get the user profile from Discord
      //   const guildMember = message.guild.members.cache.get(
      //     result[i].discord_id,
      //   );
      //   memberStr += `${i + 1}. ${guildMember} - ${result[
      //     i
      //   ].message_count.toLocaleString()}\n`;
      // }

      // // Build the RichEmbed
      // const msgEmbed = new Discord.MessageEmbed()
      //   .setColor('BLUE')
      //   .setTitle(`Top Posters in ${message.guild.name}`)
      //   .setThumbnail(message.guild.iconURL())
      //   .addField('Users', memberStr);

      // message.channel.send(msgEmbed);
    });
  },
};
