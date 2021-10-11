const Discord = require("discord.js");
const fetch = require("node-fetch");
const { qlApiUrl, qlBotUrl } = require("../helpers/constants");
const { asyncHandler } = require("./_helper");
const { serverMatcher, serverOptions } = require("../helpers/optionHelper");
const { optionNotFoundMessage, helpMessage } = require("../helpers/messageHelper");
exports.command = 'hall-of-fame';
exports.describe = 'Get members from hall of fame.';
exports.builder = (yargs) => {
  return yargs
    .option('s', {
      alias: 'server',
      demandOption: false,
      describe: 'Choose a server for the hall-of-fame command.'
    })
    .option('h', {
      alias: 'help',
      demandOption: false,
      describe: 'Show Help'
    })
};

exports.handler = asyncHandler(async (argv) => {
  if (argv.h) {
    return helpMessage(
      'hall-of-fame',
      'Get members from hall of fame.',
      '`!ql hall-of-fame [options]`',
      [
        '`-s, --server` This option is for selecting a server for the guild. [choices:  `global`, `europe`, `america`, `asia`, `veterans`]'
      ],
      [
        '`!ql hall-of-fame -s global` Get members from hall of fame on the global server.'
      ]
    );
  }

  let server;
  if (serverMatcher(argv.s)) {
    server = argv.s.toUpperCase();
  } else {
    return optionNotFoundMessage('s', 'server', argv.s, serverOptions)
  }

  const response = await fetch(qlApiUrl + `halloffame?server=${ server }`);
  const hallOfFame = response.ok
    ? await response.json()
    : null;

  if (!hallOfFame) {
    return `Unable to find hall of fame members on server: ${ server.toLowerCase() }`;
  } else {
    return printHallOfFame(hallOfFame, argv.s);
  }
});

const printHallOfFame = (hallOfFame, server) => {
  try {
    const serverName = server.charAt(0).toUpperCase() + server.slice(1).toLowerCase();
    const embed = new Discord.MessageEmbed()
        .setTitle(`${serverName}'s Hall of Fame`)
        .setThumbnail(qlBotUrl + 'hall-of-fame.png');

    const rankedPlayers = [];
    rankedPlayers.push(`Rank | Hero Power | Name`);
    for (let i = 0; i < 20; i++) {
      const data = hallOfFame.rankings[i];
      rankedPlayers.push(`${data.rank}${data.rank < 10 ? ' ': ''} | ${data.heroPower.toLocaleString()} | ${data.name}`);
    }

    embed.setDescription('Important update: This project is shutting down and will no longer be available after October 31st. All source code for developers to run this project will remain publicly available in GitHub.'
        + `\n\`\`\`${rankedPlayers.join('\n')}\`\`\``);


    return { embed };
  } catch (e) {
    console.error(e);
    return 'Unable to format hall of fame data.';
  }
};
