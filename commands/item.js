const fetch = require("node-fetch");
const Discord = require("discord.js");
const { qlApiUrl } = require("../helpers/constants");
const { asyncHandler } = require("./_helper");
const { multipleResultsFoundMessage, noResultFoundMessage, helpMessage } = require("../helpers/messageHelper");
const { cacheService } = require("../helpers/cache");
const { smarten } = require("../helpers/textHelper");

const ttl = 60 * 60; // cache for 1 Hour
const cache = new cacheService(ttl);

exports.command = 'item';
exports.describe = 'Get details about a Questland Item';
exports.builder = (yargs) => {
  return yargs
    .option('a', {
      alias: 'artifact',
      demandOption: false,
      describe: 'Choose an artifact level',
      choices: [1, 2, 3, 4, 5]
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
      'item',
      'Used to get detailed stats about an in game item at any legendary or artifact level.',
      '`!ql item <item name> [options]`',
      [
        '`-a, --artifact` Choose an artifact level [choices: 1, 2, 3, 4]'
      ],
      [
        '`!ql item Hecatombus` Get the details for Hecatombus at it\'s base level.',
        '`!ql item Hecatombus -a 4` Get the details for Hecatombus at Artifact level 4.'
      ]
    )
  }

  let temp = argv._;
  temp = temp.filter(x => x !== 'item');
  let itemName = temp.join(' ');

  // check item name against local static array. 
  let candidates = await matchItemName(itemName);

  // only process further if matchItemName returned an array
  if (Object.prototype.toString.call(candidates) === '[object Array]') {
    if (candidates.length == 1) {
      // unambiguous match, replace input (autocomplete)
      itemName = candidates[0];
    } else if (candidates.length > 1) {
      // multiple matches, suggest some candidates
      // prioritise items which start with the input term
      candidates = candidates
        .sort()
        .sort((a, b) =>
          a.toLowerCase().indexOf(itemName.toLowerCase())
          - b.toLowerCase().indexOf(itemName.toLowerCase()));

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
    param = `?quality=ARTIFACT${ argv.a }`;
  }

  const url = qlApiUrl + 'items/name/'
    + encodeURIComponent(itemName)
    + param;
  const response = await fetch(url);
  return response.ok ? printItem(await response.json()) : noResultFoundMessage(itemName, 'Item');
});

// function for retrieving a list of item names
const loadItemNames = async () => {
  const itemListUrl = qlApiUrl + 'items?filterArtifacts=true';
  const response = await fetch(itemListUrl);
  const itemJson = await response.json();
  return itemJson.map(item => item.name);
};

// match an item name against the public api data for available items
const matchItemName = async (name) => {
  try {
    // get an array of item names
    const itemNames = await cache.get('items', loadItemNames);
    // filter by name input
    const searchName = smarten(name.toLowerCase());
    const options = itemNames.filter(i => smarten(i.toLowerCase()).includes(searchName));

    if (options.length > 1) {
      const exactFinder = options.filter(i => smarten(i.toLowerCase()) === searchName);
      if (exactFinder.length === 1) {
        return exactFinder[0];
      }
    }

    return options;

  } catch (e) {
    console.error(e);
    return 'Unable to resolve item name.';
  }
};

const printItem = (item) => {
  try {
    let embed = new Discord.RichEmbed()
      .setTitle(`${ item.name }`)
      .setDescription('Love QL Bot? Please consider supporting me on [Patreon](https://www.patreon.com/thundersoap)' +
          '\n----------------------------------------------------------------')
      .addField('Quality', item.quality, false)
      .addField('Emblem', item.emblem, true)
      .addField('Item Slot', item.itemSlot, true)
      .addField('Reforge Points per level', item.reforgePointsPerLevel, true)
      .addField('Potential (hp, atk, def, mag)',
        '' + item.totalPotential
        + ' (' + item.healthPotential
        + ', ' + item.attackPotential
        + ', ' + item.defensePotential
        + ', ' + item.magicPotential + ')',
        false)
      .addField('Stats (hp, atk, def, mag)',
        '' + item.health
        + ', ' + item.attack
        + ', ' + item.defense
        + ', ' + item.magic,
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
};