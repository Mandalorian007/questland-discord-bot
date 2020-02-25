const Discord = require("discord.js");
const { asyncHandler } = require("./_helper");
const { dailyStandard, whiteBuster, intenseSwordWielding, armouredBlaster } = require("./../data/dailyBuilds");

exports.command = 'daily-boss';
exports.describe = 'Get daily boss build';
exports.builder = (yargs) => {
  return yargs
    .option('h', {
      alias: 'help',
      demandOption: false,
      describe: 'Show Help'
    })
};

exports.handler = asyncHandler(async (argv) => {
  if (argv.h) {
    return`Usage: !ql daily-boss <boss name> [options]

Commands:
  !ql daily-boss  Get SIBB's daily boss build

Options:
  -h, --help      Show help                                [boolean]

Examples:
  !ql daily-boss Hierophant     Get SIBB's daily boss build to defeat the Hierophant.
  
Boss Options:
  Shaggy Ape, Rasayan, High Necropriest, Hierophant, Stygian, Ocotmage, Scorch,
  Forest Spirit, Reptilian Warrior, Malachite Warrior, Zuulaman, Phantom Miner,
  White Claw, Bearbarian
`
  }

  let temp = argv._;
  temp = temp.filter(x => x !== 'daily-boss');
  const bossName = temp.join(' ').toLowerCase();

  const build = getBuild(bossName);
  return build ? printBuild(build) :
    `Unable to locate a build for boss: ${bossName} \nBoss Options: \n` + bossNameOptions;
});

const getBuild = (bossName) => {
  switch(bossName) {
    case 'shaggy ape':
    case 'rasayan':
    case 'high necropriest':
    case 'hierophant':
    case 'stygian':
    case 'ocotmage':
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
      return armouredBlaster;
    default:
      return undefined;
  }
};

const printBuild = (build) => {
  try {
    const embed = new Discord.RichEmbed()
      .setTitle(`${ build.name }`)
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

const bossNameOptions = `  Shaggy Ape, Rasayan, High Necropriest, Hierophant, Stygian, Ocotmage, Scorch,
  Forest Spirit, Reptilian Warrior, Malachite Warrior, Zuulaman, Phantom Miner,
  White Claw, Bearbarian`;