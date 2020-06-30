const Discord = require("discord.js");
const fetch = require("node-fetch");
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
    return getHelpMessage();
  }

  let temp = argv._;
  temp = temp.filter(x => x !== 'build');
  const buildName = temp.join(' ').toLowerCase();

  const apiBuildName = getApiBuildName(buildName);
  if (apiBuildName === undefined) {
    return getHelpMessage();
  }

  const response = await fetch('https://questland-public-api.cfapps.io/build/' + apiBuildName);
  let build = response.ok ? await response.json() : undefined;

  return build ? printBuild(build) : getHelpMessage();
});

const getApiBuildName = (buildName) => {
  switch (buildName) {
    case 'turtle':
      return 'turtle';
    case 'hecatombus':
      return 'hecatombus';
    case 'pax':
      return 'the_pax';
    case 'shinobi':
      return 'shinobi';
    case 'ratchet rush':
      return 'ratchet_rush';
    case 'red be':
      return 'red_battle_event';
    case 'blue be':
      return 'blue_battle_event';
    case 'booming turtle':
      return 'booming_turtle';
    case 'warding fang':
      return 'warding_fang';
    case 'fire blaster':
      return 'fire_blaster';
    case 'icy cannon':
      return 'icy_cannon';
    case 'the farmer':
      return 'the_farmer';
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
      '`Fire Blaster`',
      '`The Farmer`'
    ], false)
    .addField('Examples', [
      '`!ql build Turtle` Get details for the Turtle build.'
    ], false);
  return richEmbed;
}
