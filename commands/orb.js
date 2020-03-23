const fetch = require("node-fetch");
const Discord = require("discord.js");
const { asyncHandler } = require("./_helper");
const { multipleResultsFoundMessage } = require("./_helper")
const { noResultFoundMessage } = require("./_helper")

exports.command = 'orb';
exports.describe = 'Get details about a Questland Orb';
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
    return`Usage: !ql orb <orb name> [options]

Commands:
  !ql orb  Get details about a Questland Orb

Options:
  -h, --help      Show help                                [boolean]

Examples:
  !ql orb Behemoth Flames     Get the details for Behemoth Flames orb.
`
  }


  let temp = argv._;
  temp = temp.filter(x => x !== 'orb');
  let orbName = temp.join(' ');

  // check orb name against local static array. 
  let candidates = matchOrbName(orbName);

  // only process further if matchorbName returned an array
  if (Object.prototype.toString.call(candidates) === '[object Array]') {
    if (candidates.length == 1) {
      // unambiguous match, replace input (autocomplete)
      orbName = candidates[0];
    }
    else if (candidates.length > 1) {
      // multiple matches, suggest some candidates
      // prioritise orbs which start with the input term
      candidates = candidates.sort((a, b) => a.toLowerCase().indexOf(orbName.toLowerCase())
                                           - b.toLowerCase().indexOf(orbName.toLowerCase()))

      // limit number of suggestions
      const maxCandidates = 5;
      let suggestions = candidates.slice(0, maxCandidates);

      // append ellipsis, if not all matches are shown as suggestions
      if (suggestions.length < candidates.length)
        suggestions.push('...');

      // create suggestions output
      suggestions = suggestions.join('\n');

      // just show suggestions, no API call
      return multipleResultsFoundMessage(orbName, suggestions);
    }
  }

  const url = 'https://questland-public-api.cfapps.io/orbs/name/'
    + encodeURIComponent(orbName);
  const response = await fetch(url);
  
  return response.ok ? printOrb(await response.json()) : noResultFoundMessage(orbName, 'Orb');
});

// match an orb name against the static array of available item names
// TODO: make dynamic, call API then cache results, or use local DB which gets periodically updated
const matchOrbName = (name) => {
  try {
    // get static array of item names
    const module = require('../data/orbNames.js');
    const orbNames = module.orbNames;

    // filter by name input
    return orbNames.filter(i => i.toLowerCase().includes(name.toLowerCase()));
  } catch (e) {
    console.error(e);
    return 'Unable to resolve orb name.';
  }
}

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