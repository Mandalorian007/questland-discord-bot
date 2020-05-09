const Discord = require("discord.js");
const fetch = require("node-fetch");
const { asyncHandler } = require("./_helper");
const { serverMatcher, serverOptions } = require("../helpers/optionHelper");
const { optionNotFoundMessage } = require("../helpers/messageHelper");
const { dailyStandard, whiteBuster, intenseSwordWielding, everlastingStriker } = require("./../data/dailyBuilds");

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
    return `Usage: !ql daily-boss <boss name> [options]

Commands:
  !ql daily-boss  Get SIBB's daily boss build

Options:
  -h, --help      Show help                                [boolean]
  -s, --server    Select server for the Today option       [choices: 'global', 'europe', 'america', 'asia', 'veterans']

Examples:
  !ql daily-boss today -s europe   Get SIBB's daily boss build for today's boss on the Europe server.
  !ql daily-boss Hierophant        Get SIBB's daily boss build to defeat the Hierophant.
  
Boss Options:
  Today, Shaggy Ape, Rasayan, High Necropriest, Hierophant, Stygian, Octomage, Scorch,
  Forest Spirit, Reptilian Warrior, Malachite Warrior, Zuulaman, Phantom Miner,
  White Claw, Bearbarian
`
  }

  let temp = argv._;
  temp = temp.filter(x => x !== 'daily-boss');
  let bossName = temp.join(' ').toLowerCase();

  if (bossName === 'today') {
    let server = 'GLOBAL';
    if (argv.s) {
      if(serverMatcher(argv.s)) {
        server = argv.s.toUpperCase();
      } else {
        return optionNotFoundMessage('s', 'server', argv.s, serverOptions)
      }
    }

    const response = await fetch('https://questland-public-api.cfapps.io/dailyboss/current?server=' + server);
    bossName = response.ok ? await response.json().then(boss => boss.name) : `Couldn't find current daily boss`;
  }

  const build = getBuild(bossName.toLowerCase());
  return build ? printBuild(build, bossName) :
    `Unable to locate a build for boss: ${ bossName } \nBoss Options: \n` + bossNameOptions;
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
      return whiteBuster;
    case 'zuulaman':
    case 'phantom miner':
    case 'white claw':
      return intenseSwordWielding;
    case 'bearbarian':
      return everlastingStriker;
    default:
      return undefined;
  }
};

const printBuild = (build, bossName) => {
  try {
    const embed = new Discord.RichEmbed()
      .setTitle(`${ build.name }`)
      .addField('Daily Challenge Boss', titleCase(bossName), false)
      .addField('Weapons:', build.weapon1 + ', ' + build.weapon2, false)
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

const bossNameOptions = `  Today, Shaggy Ape, Rasayan, High Necropriest, Hierophant, Stygian, Octomage, Scorch,
  Forest Spirit, Reptilian Warrior, Malachite Warrior, Zuulaman, Phantom Miner,
  White Claw, Bearbarian`;

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