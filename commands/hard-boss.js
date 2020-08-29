const Discord = require("discord.js");
const fetch = require("node-fetch");
const { asyncHandler } = require("./_helper");
const { helpMessage } = require("../helpers/messageHelper");

exports.command = 'hard-boss';
exports.describe = 'Get the boss stats for a particular level of the hard boss.';
exports.builder = (yargs) => {
  return yargs
    .option('h', {
      alias: 'help',
      demandOption: false,
      describe: 'Show Help'
    })
};

exports.handler = asyncHandler(async (argv) => {
  let temp = argv._;
  const level = temp.filter(x => x !== 'hard-boss');

  if (argv.h || isNaN(level) || level < 1 || level > 120) {
    return getHelpMessage();
  }

  const response = await fetch('https://questland-public-api.cfapps.io/hardboss/stats');
  const hardBossStats = response.ok ? await response.json() : null;

  return printStats(level, hardBossStats);
});

const printStats = (level, hardBossStats) => {
  try {
    const embed = new Discord.RichEmbed()
      .setTitle(`Hard Boss Stats`)
      .setDescription('Love QL Bot? Please consider supporting me on [Patreon](https://www.patreon.com/thundersoap)' +
          '\n----------------------------------------------------------------')
      .setURL('https://questland-handbook.cfapps.io/indexes/hard-boss-stats')
      .setThumbnail('https://questland-discord-bot.cfapps.io/spreadsheet.png')
      .addField("Level", level)
      .addField("Health", Number(hardBossStats[level].health).toLocaleString())
      .addField("Attack", Number(hardBossStats[level].attack).toLocaleString())
      .addField("Defense", Number(hardBossStats[level].defense).toLocaleString())
      .addField("Magic", Number(hardBossStats[level].magic).toLocaleString());

    return { embed };
  } catch (e) {
    console.error(e);
    return 'Unable to format hard boss stats.';
  }
};

const getHelpMessage = () =>
  helpMessage(
    'hard-boss',
    'Get the boss stats for a particular level of the hard boss.',
    '`!ql hard-boss <level (1-120)>`',
    [],
    [
      '`!ql hard-boss 120'
    ]
  );