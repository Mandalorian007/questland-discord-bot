const yargs = require("yargs");
const fetch = require("node-fetch");

const itemYarg = yargs
  .scriptName("!ql")
  .usage('Usage: $0 item [options]')
  .command('item', 'Get details about a Questland Item')
  .example('!ql item Hecatombus -a 4', 'Get the details for Hecatombus at Artifact level 4.')
  .help()
  .showHelpOnFail(true)
  .version(false)
  .option('a', {
    alias: 'artifact',
    demandOption: false,
    describe: 'Choose an artifact level',
    choices: [1, 2, 3, 4]
  });

const itemYargsParsePromise = (args) => {
  return new Promise((resolve, reject) => {
    itemYarg.parse(args, (err, argv, output) => {
      // Not failing on an error
      resolve({err, argv, output})
    })
  })
};

exports.itemCommand = async (args) => {
  const result = await itemYargsParsePromise(args);
  const err = result.err;
  const argv = result.argv;
  const output = result.output;

  if (err) {
    return output;
  } else if (argv.h) {
    let response = '';
    itemYarg.showHelp(s => response = s);
    return response;
  } else {
    const itemName = argv._.join(' ');

    let param = '';
    if (argv.a) {
      param = `?quality=ARTIFACT${argv.a}`;
    }

    let url = 'https://questland-public-api.cfapps.io/items/name/'
      + encodeURIComponent(itemName)
      + param;
    const response = await fetch(url);
    return await response.ok ? printItem(await response.json()) : 'Unable to locate item.';
  }
};

const printItem = (item) => {
  try {
    let itemToPrint = item.name
      + '\nPotential (atk, mag, def, hp): ' + item.totalPotential
      + ' (' + item.attackPotential
      + ', ' + item.magicPotential
      + ', ' + item.defensePotential
      + ', ' + item.healthPotential + ')'
      + '\nQuality: ' + item.quality
      + '\nEmblem: ' + item.emblem
      + '\nItem Slot: ' + item.itemSlot
      + '\nStats (atk, mag, def, hp): '
      + item.attack
      + ', ' + item.magic
      + ', ' + item.defense
      + ', ' + item.health;

    if (item.passive1Name) {
      itemToPrint = itemToPrint + "\nItem Passives:\n"
        + item.passive1Name + ": " + item.passive1Description
        + "\n" + item.passive2Name + ": " + item.passive2Description
    }

    return itemToPrint;
  } catch (e) {
    console.error('Failed to format item data', e);
    return 'Failed to format item data :('
  }
};