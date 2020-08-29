const Discord = require("discord.js");
const fetch = require("node-fetch");
const { asyncHandler } = require("./_helper");
const { serverMatcher, serverOptions } = require("../helpers/optionHelper");
const { optionNotFoundMessage, helpMessage } = require("../helpers/messageHelper");
const { dailyStandard, whiteout, intenseSwordWielding, flamingShield } = require("./../data/dailyBuilds");

exports.command = 'daily-boss';
exports.describe = 'Get daily boss build';
exports.builder = (yargs) => {
  return yargs
    .option('s', {
      alias: 'server',
      demandOption: false,
      describe: 'Choose a server for the today command.',
    })
    .option('h', {
      alias: 'help',
      demandOption: false,
      describe: 'Show Help'
    })
};

exports.handler = asyncHandler(async (argv) => {
  if (argv.h) {
    return getHelpMessage();
  }

  let temp = argv._;
  temp = temp.filter(x => x !== 'daily-boss');
  let bossName = temp.join(' ').toLowerCase();

  if (bossName === 'today') {
    let server = 'GLOBAL';
    if (argv.s) {
      if (serverMatcher(argv.s)) {
        server = argv.s.toUpperCase();
      } else {
        return optionNotFoundMessage('s', 'server', argv.s, serverOptions)
      }
    }

    const response = await fetch('https://questland-public-api.cfapps.io/dailyboss/current?server=' + server);
    bossName = response.ok ? await response.json().then(boss => boss.name) : `Couldn't find current daily boss`;
  }

  const build = getBuild(bossName.toLowerCase());
  return build ? printBuild(build, bossName) : getHelpMessage();
});

const getBuild = (bossName) => {
  switch (bossName) {
    case 'shaggy ape':
    case 'rasayan':
    case 'high necropriest':
    case 'hierophant':
    case 'stygian':
    case 'octomage':
    case 'scorch':
    case 'forest spirit':
    case 'reptilian warrior':
      return dailyStandard;
    case 'malachite warrior':
      return whiteout;
    case 'zuulaman':
    case 'phantom miner':
    case 'white claw':
      return intenseSwordWielding;
    case 'bearbarian':
      return flamingShield;
    default:
      return undefined;
  }
};

const printBuild = (build, bossName) => {
  try {
    const embed = new Discord.RichEmbed()
      .setTitle(`${ build.name }`)
      .setDescription('Love QL Bot? Please consider supporting me on [Patreon](https://www.patreon.com/thundersoap)' +
          '\n----------------------------------------------------------------')
      .addField('Daily Challenge Boss', titleCase(bossName), false)
      .addField('Weapons: ', build.weapons, false)
      .addField('Main Hand alternatives: ', build.mainHandAlternatives, false)
      .addField('Off Hand alternatives: ', build.offHandAlternatives, false)
      .addField('Talents:',
        build.talent1 + ', ' + build.talent2 + ', ' + build.talent3, false)
      .setURL(build.details)
      .setImage(build.image);

    return { embed };
  } catch (e) {
    console.error(e);
    return 'Unable to format build data.';
  }
};

const titleCase = (str) => {
  let splitStr = str.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
};

const getHelpMessage = () =>
  helpMessage(
    'daily-boss',
    'Used to get the details for the daily boss builds',
    '`!ql daily-boss <boss options> [options]`',
    [
      '`-s, --server` This option is for selecting a server on the `today` boss option. [choices:  `global`, `europe`, `america`, `asia`, `veterans`]',
      'boss choices: ```Today, Shaggy Ape, Rasayan, High Necropriest, Hierophant, Stygian, Octomage, Scorch, Forest Spirit, Reptilian Warrior, Malachite Warrior, Zuulaman, Phantom Miner, White Claw, Bearbarian```'
    ],
    [
      '`!ql daily-boss today -s europe` Get SIBB\'s daily boss build for today\'s boss on the Europe server.',
      '`!ql daily-boss Hierophant` Get SIBB\'s daily boss build to defeat the Hierophant.'
    ]
  );