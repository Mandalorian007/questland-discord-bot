const fetch = require("node-fetch");
const Discord = require("discord.js");
const { asyncHandler } = require("./_helper");

exports.command = 'orb';
exports.describe = 'Get details about a Questland Orb';
exports.builder = {};

exports.handler = asyncHandler(async (argv) => {
  let temp = argv._;
  temp = temp.filter(x => x !== 'orb');
  const orbName = temp.join(' ');

  let url = 'https://questland-public-api.cfapps.io/orbs/name/'
    + encodeURIComponent(orbName);
  const response = await fetch(url);
  return response.ok ? printOrb(await response.json()) : 'Unable to locate orb.';
});

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
    return 'Unable to format orb data.';
  }
};