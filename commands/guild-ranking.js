const Discord = require("discord.js");
const fetch = require("node-fetch");
const { qlApiUrl, qlBotUrl } = require("../helpers/constants");
const { asyncHandler } = require("./_helper");
const { serverMatcher, serverOptions } = require("../helpers/optionHelper");
const { optionNotFoundMessage, helpMessage } = require("../helpers/messageHelper");

exports.command = 'guild-ranking';
exports.describe = 'Get guild ranks.';
exports.builder = (yargs) => {
  return yargs
    .option('s', {
      alias: 'server',
      demandOption: false,
      describe: 'Choose a server for the guild-ranking command.'
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
      'guild-ranking',
      'Get guild ranks.',
      '`!ql guild-rank [options]`',
      [
        '`-s, --server` This option is for selecting a server for the guild. [choices:  `global`, `europe`, `america`, `asia`, `veterans`]'
      ],
      [
        '`!ql guild-ranking -s global` Get guild rankings on the global server.'
      ]
    );
  }

  let server;
  if (serverMatcher(argv.s)) {
    server = argv.s.toUpperCase();
  } else {
    return optionNotFoundMessage('s', 'server', argv.s, serverOptions)
  }

  const response = await fetch(qlApiUrl + `guildranking?server=${ server }`);
  const guildranking = response.ok
    ? await response.json()
    : null;

  if (!guildranking) {
    return `Unable to find guild ranking on server: ${ server.toLowerCase() }`;
  } else {
    return printGuildRanking(guildranking, argv.s);
  }
});

const printGuildRanking = (guildRanking, server) => {
  try {
    const serverName = server.charAt(0).toUpperCase() + server.slice(1).toLowerCase();
    const embed = new Discord.MessageEmbed()
        .setTitle(`${serverName}'s Guild Ranking`)
        .setThumbnail(qlBotUrl + 'guild-ranking.png');

    const rankedGuilds = [];
    rankedGuilds.push(`Rank | Score | Name`);
    for (let i = 0; i < 20; i++) {
      const data = guildRanking.rankings[i];
      rankedGuilds.push(`${data.rank}${data.rank < 10 ? ' ': ''} | ${data.guildScore.toLocaleString()} | ${data.name}`);
    }

    embed.setDescription('Important update: Starting in May Gamesture will be taking over the QL Bot, Public API, and Questland Handbook site. I have decided to extend my support through April so that no community member needs to go without for that period of time. Happy Questing!'
        + `\n\`\`\`${rankedGuilds.join('\n')}\`\`\``);


    return { embed };
  } catch (e) {
    console.error(e);
    return 'Unable to format guild ranking data.';
  }
};
