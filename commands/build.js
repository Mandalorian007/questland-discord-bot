const Discord = require("discord.js");
const { turtle, theHecatombus, thePax, shinobi, ratchetRush, boomingTurtle, wardingFang, fireBlaster, icyCannon, redBattleEvent, blueBattleEvent } = require("../data/buildData");
const { asyncHandler } = require("./_helper");
const { helpMessage } = require("../helpers/messageHelper");

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
    return getHelpMessage();
  }

  let temp = argv._;
  temp = temp.filter(x => x !== 'build');
  const buildName = temp.join(' ').toLowerCase();

  const build = getBuild(buildName);
  return build ? printBuild(build) : getHelpMessage();
});

const getBuild = (buildName) => {
  switch (buildName) {
    case 'turtle':
      return turtle;
    case 'hecatombus':
      return theHecatombus;
    case 'pax':
      return thePax;
    case 'shinobi':
      return shinobi;
    case 'ratchet rush':
      return ratchetRush;
    case 'red be':
      return redBattleEvent;
    case 'blue be':
      return blueBattleEvent;
    case 'booming turtle':
      return boomingTurtle;
    case 'warding fang':
      return wardingFang;
    case 'fire blaster':
      return fireBlaster;
    case 'icy cannon':
      return icyCannon;
    default:
      return undefined;
  }
};

const printBuild = (build) => {
  try {
    const embed = new Discord.RichEmbed()
      .setTitle(`${ build.name }`)

    if (build.description) {
      embed.addField('Description:', build.description, false);
    }

    embed
      .addField('Weapons: ', build.weapons, false)
      .addField('Main Hand alternatives: ', build.mainHandAlternatives, false)
      .addField('Off Hand alternatives: ', build.offHandAlternatives, false)

      .addField('Talents:',
        build.talent1 + ', ' + build.talent2 + ', ' + build.talent3, false)
      .setURL(build.videoGuide)
      .setImage(build.image)
      .setFooter('Love QL Bot? Check out the about command for more good stuff!',
        'https://questland-discord-bot.cfapps.io/ql_weasel.png');

    if (build.links) {
      embed.addField('Links:', build.links, false);
    }

    return { embed };
  } catch (e) {
    console.error(e);
    return 'Unable to format build data.';
  }
};

const getHelpMessage = () => {
  const richEmbed = new Discord.RichEmbed();
  richEmbed
    .setTitle('build')
    .setDescription('Used to get the details for common Questland builds')
    .addField('Usage', `!ql build <build options>`, false)
    .addField('Core/ Popular Build Options', [
      '`Turtle`',
      '`Hecatombus`'
    ], false)
    .addField('Campaign Favorite Build Options', [
      '`Pax`',
      '`Ratchet Rush`',
      '`Shinobi`'
    ], false)
    .addField('Battle Event Build Options', [
      '`Red BE`',
      '`Blue BE`'
    ], false)
    .addField('Arena Build Options', [
      '`Booming Turtle`',
      '`Warding Fang`',
      '`Icy Cannon`',
      '`Fire Blaster`'
    ], false)
    .addField('Examples', [
      '`!ql build Turtle` Get details for the Turtle build.'
    ], false);
  return richEmbed;
}
