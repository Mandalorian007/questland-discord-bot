const Discord = require("discord.js");
const fetch = require("node-fetch");
const { qlApiUrl } = require("../helpers/constants");
const { asyncHandler } = require("./_helper");
const { helpMessage } = require("../helpers/messageHelper");

exports.command = 'guild-boss';
exports.describe = 'Get the boss stats for a particular level of the guild boss.';
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
  const level = temp.filter(x => x !== 'guild-boss');

  if (argv.h || isNaN(level) || level < 1 || level > 150) {
    return getHelpMessage();
  }

  const response = await fetch(qlApiUrl + 'guildboss/stats');
  const guildBossStats = response.ok ? await response.json() : null;

  return printStats(level, guildBossStats);
});

const printStats = (level, guildBossStats) => {
  try {
    const embed = new Discord.RichEmbed()
      .setTitle(`Guild Boss Stats`)
      .setDescription('Love QL Bot? Please consider supporting me on [Patreon](https://www.patreon.com/thundersoap)' +
          '\n----------------------------------------------------------------')
      .setURL('https://questland-handbook.cfapps.io/indexes/guild-boss-stats')
      .setThumbnail('https://questland-discord-bot.cfapps.io/spreadsheet.png')
      .addField("Level", level)
      .addField("Health", Number(guildBossStats[level].health).toLocaleString())
      .addField("Attack", Number(guildBossStats[level].attack).toLocaleString())
      .addField("Defense", Number(guildBossStats[level].defense).toLocaleString())
      .addField("Magic", Number(guildBossStats[level].magic).toLocaleString())

    return { embed };
  } catch (e) {
    console.error(e);
    return 'Unable to format guild boss stats.';
  }
};

const getHelpMessage = () =>
  helpMessage(
    'guild-boss',
    'Get the boss stats for a particular level of the guild boss.',
    '`!ql guild-boss <level (1-150)>`',
    [],
    [
      '`!ql guild-boss 120'
    ]
  );