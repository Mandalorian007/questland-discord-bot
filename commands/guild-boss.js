const Discord = require("discord.js");
const fetch = require("node-fetch");
const { qlApiUrl, qlBotUrl, qlHandbookUrl } = require("../helpers/constants");
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
    const embed = new Discord.MessageEmbed()
      .setTitle(`Guild Boss Stats`)
      .setDescription('Important update: Starting in May Gamesture will be taking over the QL Bot, Public API, and Questland Handbook site. I have decided to extend my support through April so that no community member needs to go without for that period of time. Happy Questing!')
      .setURL(qlHandbookUrl + 'indexes/guild-boss-stats')
      .setThumbnail(qlBotUrl + 'spreadsheet.png')
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