const yargs = require("yargs");
const fetch = require("node-fetch");
const Discord = require("discord.js");

const orbYarg = yargs
  .scriptName("!ql")
  .usage('Usage: $0 orb [options]')
  .command('orb', 'Get details about a Questland Orb')
  .example('!ql orb Behemoth Flames', 'Get the details for Behemoth Flames')
  .help()
  .showHelpOnFail(true)
  .version(false);

const orbYargsParsePromise = (args) => {
  return new Promise((resolve, reject) => {
    orbYarg.parse(args, (err, argv, output) => {
      // Not failing on an error
      resolve({ err, argv, output })
    })
  })
};

exports.orbCommand = async (args) => {
  const result = await orbYargsParsePromise(args);
  const err = result.err;
  const argv = result.argv;
  const output = result.output;

  if (err) {
    return output;
  } else if (argv.h) {
    let response = '';
    orbYarg.showHelp(s => response = s);
    return response;
  } else {
    const orbName = argv._.join(' ');

    let url = 'https://questland-public-api.cfapps.io/orbs/name/'
      + encodeURIComponent(orbName);
    const response = await fetch(url);
    return await response.ok ? printOrb(await response.json()) : 'Unable to locate orb.';
  }
};

const printOrb = (orb) => {
  try {
    const embed = new Discord.RichEmbed()
      .setTitle(`${ orb.name }`)
      .addField('Potential (atk, mag, def, hp)',
        '' + orb.attackPotential
        + ', ' + orb.magicPotential
        + ', ' + orb.defensePotential
        + ', ' + orb.healthPotential,
        false)
      .addField('Quality', orb.quality, false)
      .addField('Stats (atk, mag, def, hp)',
        '' + orb.attack
        + ', ' + orb.magic
        + ', ' + orb.defense
        + ', ' + orb.health,
        false);

    return { embed };
  } catch (e) {
    console.error(e);
    return 'Unable to locate orb.'
  }
};