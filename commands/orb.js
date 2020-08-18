const fetch = require("node-fetch");
const Discord = require("discord.js");
const { asyncHandler } = require("./_helper")
const { optionNotFoundMessage, multipleResultsFoundMessage, noResultFoundMessage, helpMessage } = require("../helpers/messageHelper");
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
    return helpMessage(
      'orb',
      'Used to get detailed stats about an in game orb at legendary or artifact level.',
      '`!ql orb <orb name> [options]`',
      [
        '`-a, --artifact` Choose an artifact level [choices: 1]',
        '`-l, --level` Select the orb level. Default is 1 [max legendary: 100, max artifact: 180]',
        '`-e, --enhance` Choose an enhancement level. Default is 0 [choices: 0-10]'
      ],
      [
        '`!ql orb Behemoth Flames` Get the details for Behemoth Flames orb.',
        '`!ql orb Requiem -a 1` Get the details for Requem orb at Artifact level 1.',
        '`!ql orb Requiem -l 100` Get the details for Requem orb with stats at level 100.',
        '`!ql orb Requiem -l 100 -e 5` Get the details for Requem with stats at level 100 and enhanced to level 5.',
        '`!ql orb Requiem -a 1 -l 180 -e 5` Get the details for Requem artifact orb with stats at level 180 and enhanced to level 5.'
      ]
    )
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
  let enhance = 0;
  if (argv.e) {
    const desiredEnhance = parseInt(argv.e);
    if (desiredEnhance > 10 || desiredEnhance < 0) {
      return optionNotFoundMessage('e', 'enhance', argv.e, [0,1,2,3,4,5,6,7,8,9,10])
    }
    enhance = desiredEnhance;
  }
  let level = 1;
  if (argv.l) {
    const desiredLevel = parseInt(argv.l);
    if (desiredLevel < 1 || (argv.a && desiredLevel > 180) || (!argv.a && desiredLevel > 100)) {
      return optionNotFoundMessage('l', 'level', argv.l, ['legendary 1-100', 'artifact 1-180'])
    }
    level = desiredLevel;
  }

  const url = 'https://questland-public-api.cfapps.io/orbs/name/'
    + encodeURIComponent(orbName)
    + param;
  const response = await fetch(url);

  if (response.ok) {
    const orbData = await response.json();
    const scaledOrb = scaleOrb(orbData, enhance, level);

    return printOrb(scaledOrb);
  } else {
    return noResultFoundMessage(orbName, 'Orb');
  }
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
    const searchName = smarten(name.toLowerCase());
    const options = orbNames.filter(i => smarten(i.toLowerCase()).includes(searchName));

    if (options.length > 1) {
      const exactFinder = options.filter(i => smarten(i.toLowerCase()) === searchName)
      if (exactFinder.length === 1) {
        return exactFinder[0];
      }
    }

    return options;

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

const scaleOrb = (orb, enhance, level) => {
  orb.healthPotential = scalePotential(orb.healthPotential, enhance);
  orb.attackPotential = scalePotential(orb.attackPotential, enhance);
  orb.defensePotential = scalePotential(orb.defensePotential, enhance);
  orb.magicPotential = scalePotential(orb.magicPotential, enhance);

  orb.health = scaleBaseStat(orb.health, enhance, orb.healthPotential, level)
  orb.attack = scaleBaseStat(orb.attack, enhance, orb.attackPotential, level)
  orb.defense = scaleBaseStat(orb.defense, enhance, orb.defensePotential, level)
  orb.magic = scaleBaseStat(orb.magic, enhance, orb.magicPotential, level)

  orb.enhance = enhance;
  orb.level = level;

  return orb;
}

const scalePotential = (potential, enhance) => {
  if (potential < 1) {
    return potential;
  }
  return potential + (potential * (.05 * enhance));

}
const scaleBaseStat = (baseStat, enhance, enhancedPotential, level) => {
  if (baseStat < 1) {
    return baseStat;
  }
  const enhancedBaseStat = baseStat + (baseStat * (.05 * enhance));
  return enhancedBaseStat + (enhancedPotential * (level - 1));
}

const printOrb = (scaledOrb) => {
  try {
    const embed = new Discord.RichEmbed()
      .setTitle(`${ scaledOrb.name }`)
      .addField(`Potential at enhance ${scaledOrb.enhance} (hp, atk, def, mag)`,
        '' + scaledOrb.healthPotential
        + ', ' + scaledOrb.attackPotential
        + ', ' + scaledOrb.defensePotential
        + ', ' + scaledOrb.magicPotential,
        false)
      .addField('Quality', scaledOrb.quality, false)
      .addField(`Stats at enhance ${scaledOrb.enhance} and level ${scaledOrb.level} (hp, atk, def, mag)`,
        '' + scaledOrb.health
        + ', ' + scaledOrb.attack
        + ', ' + scaledOrb.defense
        + ', ' + scaledOrb.magic,
        false)
      .setFooter('Love QL Bot? Check out the about command for more good stuff!',
        'https://questland-discord-bot.cfapps.io/ql_weasel.png');

    return { embed };
  } catch (e) {
    console.error(e);
    return 'Unable to format scaledOrb data.';
  }
};
