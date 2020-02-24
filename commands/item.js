const fetch = require("node-fetch");
const Discord = require("discord.js");
const { asyncHandler } = require("./_helper");

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
};

exports.handler = asyncHandler(async (argv) => {
  let temp = argv._;
  temp = temp.filter(x => x !== 'item');
  const itemName = temp.join(' ');

  let param = '';
  if (argv.a) {
    param = `?quality=ARTIFACT${ argv.a }`;
  }

  let url = 'https://questland-public-api.cfapps.io/items/name/'
    + encodeURIComponent(itemName)
    + param;
  const response = await fetch(url);
  return response.ok ? printItem(await response.json()) : 'Unable to locate item.';
});

const printItem = (item) => {
  try {
    let embed = new Discord.RichEmbed()
      .setTitle(`${ item.name }`)
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