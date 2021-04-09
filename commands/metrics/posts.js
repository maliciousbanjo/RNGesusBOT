const Discord = require('discord.js');
const dbUtils = require('../../helpers/databaseUtils');
const db = dbUtils.getConnectionPool();
const QuickChart = require('quickchart-js');

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
      WHERE user.discord_id!='${message.client.user.id}'
      GROUP BY discord_id 
      ORDER BY message_count 
      DESC LIMIT 10
    `;

    // Fake data used to test charts
    const fakeResult = [
      {
        username: 'Joe',
        message_count: 103275,
      },
      {
        username: 'Disco',
        message_count: 90106,
      },
      {
        username: 'Muffin',
        message_count: 72850,
      },
      {
        username: 'meez',
        message_count: 63168,
      },
      {
        username: 'Alec',
        message_count: 41367,
      },
      {
        username: 'Rob',
        message_count: 33951,
      },
      {
        username: 'Asou',
        message_count: 10722,
      },
      {
        username: 'Chubb',
        message_count: 7696,
      },
      {
        username: 'Luthien',
        message_count: 7429,
      },
      {
        username: 'Sam',
        message_count: 4359,
      },
    ];

    const userNames = fakeResult.map((userResult) => userResult.username);
    const userData = fakeResult.map((userResult) => userResult.message_count);

    db.query(query, async (error, result) => {
      if (error) {
        console.error(`MySQL ${error}`);
        throw error;
      }
      if (result.length === 0) {
        message.channel.send('There are no recorded messages');
        return;
      }

      // Process result data for the chart
      const guildMembers = result.map((dbResult) => {
        return message.guild.members.cache.get(dbResult.discord_id).displayName;
      });

      const messageData = result.map((dbResult) => dbResult.message_count);

      // ChartJS setup
      const chart = new QuickChart();
      chart.setConfig({
        type: 'horizontalBar',
        data: {
          labels: guildMembers,
          //labels: userNames,
          datasets: [
            {
              label: 'Messages Sent',
              //data: userData,
              data: messageData,
              backgroundColor: '#0099E1',
            },
          ],
        },
        options: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: `Top Posters in ${message.guild.name}`,
          },
          scales: {
            yAxes: [
              {
                ticks: {},
              },
            ],
            xAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  callback: (value) => {
                    if (value % 1 === 0) {
                      return value;
                    }
                  },
                },
                scaleLabel: {
                  display: true,
                  fontStyle: 'bold',
                  labelString: 'Messages Sent',
                },
              },
            ],
          },
        },
      });

      chart.toBinary().then((buffer) => {
        message.channel.send(new Discord.MessageAttachment(buffer));
      });
      /**Original Way */

      // const chartEmbed = new Discord.MessageEmbed()
      //   .setTitle(`Top Posters in ${message.guild.name}`)
      //   //.setDescription('This is a chart')
      //   .setColor('BLUE')
      //   //.setThumbnail(message.guild.iconURL())
      //   .setImage(chart.getUrl());
      // message.channel.send(chartEmbed);

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
