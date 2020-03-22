const fetch = require("node-fetch");
const Discord = require("discord.js");
const { asyncHandler } = require("./_helper");
const sherlockAttachment = new Discord.Attachment('./public/sherlock.png');
const noideaAttachment = new Discord.Attachment('./public/noidea.png');

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

  let candidates = resolveItemName(itemName); // check item name against local static array 
  if (Object.prototype.toString.call(candidates) === '[object Array]') { // only continue if resolveItemName returned an array
    if (candidates.length == 1) { // unambiguous match, replace input
      itemName = candidates[0]; 
    }
    else if (candidates.length > 1) { // multiple matches, suggest some candidates
      const maxCandidates = 5;
      let suggestions = candidates.slice(0, maxCandidates);
      if (candidates.length > maxCandidates) 
        suggestions.push('...');
      suggestions = suggestions.join("\n");
      let embed = new Discord.RichEmbed()
        .setTitle(`Multiple results for '${itemName}'`)
        .addField('Did you mean:', `${suggestions}`)
        .attachFile(sherlockAttachment)
        .setThumbnail('attachment://sherlock.png');
      return { embed }; 
    }
  }

  let param = '';
  if (argv.a) {
    param = `?quality=ARTIFACT${argv.a}`;
  }

  let url = 'https://questland-public-api.cfapps.io/items/name/'
    + encodeURIComponent(itemName)
    + param;
  const response = await fetch(url);
  return response.ok ? printItem(await response.json()) : new Discord.RichEmbed()
    .setTitle(`Item '${itemName}' not found`)
    .addField('Please check your input', '\u200b')
    .attachFile(noideaAttachment)
    .setThumbnail('attachment://noidea.png');
});

/// match an item name against the static array of available item names
const resolveItemName = (name) => {
  try {
    let module = require('../data/itemNames.js');
    let itemNames = module.itemNames;
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
};