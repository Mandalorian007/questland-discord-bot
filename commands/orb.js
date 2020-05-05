const fetch = require("node-fetch");
const Discord = require("discord.js");
const { asyncHandler } = require("./_helper")
const { multipleResultsFoundMessage, noResultFoundMessage } = require("../helpers/messageHelper");
const { cacheService } = require("../helpers/cache");

const ttl = 60 * 60; // cache for 1 Hour
const cache = new cacheService(ttl);

exports.command = 'orb';
exports.describe = 'Get details about a Questland Orb';
exports.builder = (yargs) => {
  return yargs
    .option('a', {
      alias: 'artifact',
      demandOption: false,
      describe: 'Choose an artifact level',
      choices: [1]
    })
    .option('h', {
      alias: 'help',
      demandOption: false,
      describe: 'Show Help'
    })
};

exports.handler = asyncHandler(async (argv) => {
  if (argv.h) {
    return `Usage: !ql orb <orb name> [options]

Commands:
  !ql orb  Get details about a Questland Orb

Options:
  -a, --artifact  Choose an artifact level                 [choices: 1]
  -h, --help      Show help                                [boolean]

Examples:
  !ql orb Behemoth Flames     Get the details for Behemoth Flames orb.
  !ql orb Requiem -a 1 Get the details for Requem orb at Artifact level 1.
`
  }
    
  let temp = argv._;
  temp = temp.filter(x => x !== 'orb');
  let orbName = temp.join(' ');

  // check orb name against local static array. 
  let candidates = await matchOrbName(orbName);

  // only process further if matchorbName returned an array
  if (Object.prototype.toString.call(candidates) === '[object Array]') {
    if (candidates.length == 1) {
      // unambiguous match, replace input (autocomplete)
      orbName = candidates[0];
    } else if (candidates.length > 1) {
      // multiple matches, suggest some candidates
      // prioritise orbs which start with the input term
      candidates = candidates
        .sort()
        .sort((a, b) =>
          a.toLowerCase().indexOf(orbName.toLowerCase())
          - b.toLowerCase().indexOf(orbName.toLowerCase()));

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

  let param = '';
  if (argv.a) {
    param = `?quality=ARTIFACT${ argv.a }`;
  }
  
  const url = 'https://questland-public-api.cfapps.io/orbs/name/'
	+ encodeURIComponent(orbName)
	+ param;
  const response = await fetch(url);

  return response.ok ? printOrb(await response.json()) : noResultFoundMessage(orbName, 'Orb');
});

// function for retrieving a list of orb names
const loadOrbNames = async () => {
  const orbListUrl = 'https://questland-public-api.cfapps.io/orbs?filterArtifacts=true';
  const response = await fetch(orbListUrl);
  const orbJson = await response.json();
  return orbJson.map(orb => orb.name);
};

// match an item name against the public api data for available orbs
const matchOrbName = async (name) => {
  try {
    // get an array of orb names
    const orbNames = await cache.get('orbs', loadOrbNames);
    // filter by name input
    return orbNames.filter(i => smarten(i.toLowerCase()).includes(smarten(name.toLowerCase())));

  } catch (e) {
    console.error(e);
    return 'Unable to resolve orb name.';
  }
};

// Change straight quotes to curly and double hyphens to em-dashes.
const smarten = (text) => {
  text = text.replace(/(^|[-\u2014\s(\["])'/g, "$1\u2018");       // opening singles
  text = text.replace(/'/g, "\u2019");                            // closing singles & apostrophes
  text = text.replace(/(^|[-\u2014/\[(\u2018\s])"/g, "$1\u201c"); // opening doubles
  text = text.replace(/"/g, "\u201d");                            // closing doubles
  text = text.replace(/--/g, "\u2014");                           // em-dashes
  return text
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
    return 'Unable to format orb data.';
  }
};
