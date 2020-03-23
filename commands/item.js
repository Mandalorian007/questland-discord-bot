const fetch = require("node-fetch");
const Discord = require("discord.js");
const { asyncHandler } = require("./_helper");
const { multipleResultsFoundMessage } = require("./_helper")
const { noResultFoundMessage } = require("./_helper")


exports.command = 'item';
exports.describe = 'Get details about a Questland Item';
exports.builder = (yargs) => {
  return yargs
    .option('a', {
      alias: 'artifact',
      demandOption: false,
      describe: 'Choose an artifact level',
      choices: [1, 2, 3, 4]
    })
    .option('h', {
      alias: 'help',
      demandOption: false,
      describe: 'Show Help'
    })
};

exports.handler = asyncHandler(async (argv) => {
  if (argv.h) {
    return `Usage: !ql item <item name> [options]

Commands:
  !ql item  Get details about a Questland Item

Options:
  -a, --artifact  Choose an artifact level                 [choices: 1, 2, 3, 4]
  -h, --help      Show help                                [boolean]

Examples:
  !ql item Hecatombus Get the details for Hecatombus at it's base level.
  !ql item Hecatombus -a 4  Get the details for Hecatombus at Artifact level 4.
`
  }

  let temp = argv._;
  temp = temp.filter(x => x !== 'item');
  let itemName = temp.join(' ');

  // check item name against local static array. 
  let candidates = matchItemName(itemName);

  // only process further if matchItemName returned an array
  if (Object.prototype.toString.call(candidates) === '[object Array]') {
    if (candidates.length == 1) {
      // unambiguous match, replace input (autocomplete)
      itemName = candidates[0];
    }
    else if (candidates.length > 1) {
      // multiple matches, suggest some candidates
      // prioritise items which start with the input term
      candidates = candidates.sort((a, b) => a.toLowerCase().indexOf(itemName.toLowerCase())
                                           - b.toLowerCase().indexOf(itemName.toLowerCase()))

      // limit number of suggestions
      const maxCandidates = 5;
      let suggestions = candidates.slice(0, maxCandidates);

      // append ellipsis, if not all matches are shown as suggestions
      if (suggestions.length < candidates.length)
        suggestions.push('...');

      // create suggestions output
      suggestions = suggestions.join('\n');

      // just show suggestions, no API call
      return multipleResultsFoundMessage(itemName, suggestions);
    }
  }

  let param = '';
  if (argv.a) {
    param = `?quality=ARTIFACT${argv.a}`;
  }

  const url = 'https://questland-public-api.cfapps.io/items/name/'
    + encodeURIComponent(itemName)
    + param;
  const response = await fetch(url);
  return response.ok ? printItem(await response.json()) : noResultFoundMessage(itemName, 'Item');
});

// match an item name against the static array of available item names
// TODO: make dynamic, call API then cache results, or use local DB which gets periodically updated
const matchItemName = (name) => {
  try {
    // get static array of item names
    const module = require('../data/itemNames.js');
    const itemNames = module.itemNames;

    // filter by name input
    return itemNames.filter(i => i.toLowerCase().includes(name.toLowerCase()));
  } catch (e) {
    console.error(e);
    return 'Unable to resolve item name.';
  }
}

const printItem = (item) => {
  try {
    let embed = new Discord.RichEmbed()
      .setTitle(`${item.name}`)
      .addField('Potential (atk, mag, def, hp)',
        '' + item.totalPotential
        + ' (' + item.attackPotential
        + ', ' + item.magicPotential
        + ', ' + item.defensePotential
        + ', ' + item.healthPotential + ')',
        false)
      .addField('Quality', item.quality, false)
      .addField('Emblem', item.emblem, false)
      .addField('Item Slot', item.itemSlot, false)
      .addField('Stats (atk, mag, def, hp)',
        '' + item.attack
        + ', ' + item.magic
        + ', ' + item.defense
        + ', ' + item.health,
        false);

    if (item.passive1Name) {
      embed.addField('Item Passive 1',
        item.passive1Name + ": " + item.passive1Description, false)
      embed.addField('Item Passive 2',
        item.passive2Name + ": " + item.passive2Description, false)
    }
    return { embed };
  } catch (e) {
    console.error(e);
    return 'Unable to format item data.';
  }
}