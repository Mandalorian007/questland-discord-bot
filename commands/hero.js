const Discord = require("discord.js");
const fetch = require("node-fetch");
const { asyncHandler } = require("./_helper");
const { serverMatcher, serverOptions } = require("../helpers/optionHelper");
const { optionNotFoundMessage } = require("../helpers/messageHelper");

exports.command = 'hero';
exports.describe = 'Get details about a hero';
exports.builder = (yargs) => {
  return yargs
    .option('g', {
      alias: 'guild',
      demandOption: true,
      describe: 'Specify the guild your character is currently in.',
      type: 'array'
    })
    .option('s', {
      alias: 'server',
      demandOption: true,
      describe: 'Choose a server for the today command.'
    })
    .option('h', {
      alias: 'help',
      demandOption: false,
      describe: 'Show Help'
    })
};

exports.handler = asyncHandler(async (argv) => {
  if (argv.h) {
    return `Usage: !ql hero <hero name> [options]

Commands:
  !ql guild RedruM -s global  Get the RedruM guild's details from the global server.

Options:
  -h, --help      Show help                                [boolean]
  -g, --guild     Specify the guild your hero is in        [text]
  -s, --server    Select server for the Today option       [choices: 'global', 'europe', 'america', 'asia', 'veterans']

Examples:
  !ql hero ThunderSoap -g RedruM -s global  Get ThunderSoap's hero profile from the RedruM guild on Global.
`
  }

  let temp = argv._;
  temp = temp.filter(x => x !== 'hero');
  const heroName = temp.join(' ');
  const guildName = argv.g.join(' ');
  let server;
  if(serverMatcher(argv.s)) {
    server = argv.s.toUpperCase();
  } else {
    return optionNotFoundMessage('s', 'server', argv.s, serverOptions)
  }

  const url = `https://questland-public-api.cfapps.io/hero/${ encodeURI(guildName) }/${ heroName }?server=${ server }`;
  const response = await fetch(url);
  const hero = response.ok
    ? await response.json()
    : null;

  if (!hero) {
    return `Unable to locate a hero for name: "${ heroName }" in guild: "${ guildName }" on server: ${ server.toLowerCase() }`;
  } else {
    return printHero(hero);
  }
});

const printHero = (hero) => {

  try {
    const embed = new Discord.RichEmbed()
      .setTitle(`${ hero.name } [ ${ hero.server } - ${ hero.guild }]`)
      .addField('Level', hero.level, false)
      .addField('Days Played', hero.daysPlayed, false)
      .addField('Hall of Fame Rank', hero.heroPowerRank, false)
      .addField('Arena Rank', hero.heroPvpRank, false)
      .addField('VIP', hero.vip, false)
      .addField('Hero Power (hp, atk, def, mag)',
        `${ hero.heroPower } (${ hero.health }, ${ hero.attack }, ${ hero.defense }, ${ hero.magic })`,
        false)
    return { embed };
  } catch (e) {
    console.error(e);
    return 'Unable to format hero data.';
  }
};
