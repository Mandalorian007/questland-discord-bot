const Discord = require("discord.js");
const fetch = require("node-fetch");
const { asyncHandler } = require("./_helper");
const { serverMatcher, serverOptions } = require("../helpers/optionHelper");
const { optionNotFoundMessage, helpMessage } = require("../helpers/messageHelper");

exports.command = 'hero';
exports.describe = 'Get details about a hero';
exports.builder = (yargs) => {
  return yargs
    .option('g', {
      alias: 'guild',
      demandOption: false,
      describe: 'Specify the guild your character is currently in.',
      type: 'array'
    })
    .option('s', {
      alias: 'server',
      demandOption: false,
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
    return helpMessage(
      'hero',
      'Used to get the details for a specific hero based on their server and guild',
      '`!ql hero <hero name> [options]`',
      [
        '`-g, --guild` This option needs to be supplied the name of the guild that the hero is in.',
        '`-s, --server` This option is for selecting a server for the guild. [choices:  `global`, `europe`, `america`, `asia`, `veterans`]'
      ],
      [
        '`!ql hero ThunderSoap -g RedruM -s global`  Get ThunderSoap\'s hero profile from the RedruM guild on Global.'
      ]
    );
  }

  let temp = argv._;
  temp = temp.filter(x => x !== 'hero');
  const heroName = temp.join(' ');
  if (!argv.g) {
    return optionNotFoundMessage('g', 'guild', argv.g, [])
  }
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
      .setThumbnail('https://questland-discord-bot.cfapps.io/armor.png')
    return { embed };
  } catch (e) {
    console.error(e);
    return 'Unable to format hero data.';
  }
};
