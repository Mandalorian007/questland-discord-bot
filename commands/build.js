const Discord = require("discord.js");
const { turtle, theHecatombus, thePax, ratchetRush } = require("../data/popularBuilds");
const { asyncHandler } = require("./_helper");

exports.command = 'build';
exports.describe = 'Get details for a popular build';
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
    return`Usage: !ql build <build name> [options]

Commands:
  !ql build  Get details for a popular build

Options:
  -h, --help      Show help                                [boolean]

Examples:
  !ql build Turtle     Get details for the Turtle build.
  
Build Options:
  Turtle, Hecatombus, Pax, Ratchet Rush
`
  }

  let temp = argv._;
  temp = temp.filter(x => x !== 'build');
  const buildName = temp.join(' ').toLowerCase();

  const build = getBuild(buildName);
  return build ? printBuild(build) :
    `Unable to locate a build: ${buildName} \nBuild Options: \n` + buildNameOptions;
});

const getBuild = (buildName) => {
  switch(buildName) {
    case 'turtle':
      return turtle;
    case 'hecatombus':
      return theHecatombus;
    case 'pax':
      return thePax;
    case 'ratchet rush':
      return ratchetRush;
    default:
      return undefined;
  }
};

const printBuild = (build) => {
  try {
    const embed = new Discord.RichEmbed()
      .setTitle(`${ build.name }`)
      .addField('Weapons: ', build.weapons, false)
      .addField('Weapon alternatives: ', build.weaponAlternates, false)
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

const buildNameOptions = `  Turtle, Hecatombus, Pax, Ratchet Rush`;