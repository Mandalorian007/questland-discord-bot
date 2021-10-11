const Discord = require("discord.js");
const fetch = require("node-fetch");
const { qlApiUrl, qlBotUrl } = require("../helpers/constants");
const { asyncHandler } = require("./_helper");
const { helpMessage } = require("../helpers/messageHelper");

exports.command = 'monster-slayer';
exports.describe = 'Get stage scores for Monster Slayer';
exports.builder = (yargs) => {
  return yargs
    .option('h', {
      alias: 'help',
      demandOption: false,
      describe: 'Show Help'
    })
};

exports.handler = asyncHandler(async (argv) => {
  if (argv.h) {
    return getHelpMessage();
  }

  const response = await fetch(qlApiUrl + 'monster-slayer');
  const monsterSlayer = response.ok ? await response.json().then(data => data.stageScores) : null;

  return printScores(monsterSlayer);
});

const printScores = (monsterSlayer) => {
  try {
    const embed = new Discord.MessageEmbed()
        .setTitle(`Monster Slayer`)
        .setThumbnail(qlBotUrl + 'monster-slayer-coffee.png');
    if(monsterSlayer) {

        const levelData = [];
        levelData.push(`Score | Location - Stage`);
        for (let i = 0; i < 10; i++) {
            const data = monsterSlayer[i];
            levelData.push(`${data.stageScore} | ${data.locationName} - ${data.stageName}`);
        }

        embed.setDescription('Important update: This project is shutting down and will no longer be available after October 31st. All source code for developers to run this project will remain publicly available in GitHub.'
            + '\n----------------------------------------------------------------'
            + `\n\`\`\`${levelData.join('\n')}\`\`\``);
    } else {
        embed.addField(
        'No active monster slayer quest found',
        `If you would like to calculate the quest manually please visit: [Monster Slayer Calculator](${qlApiUrl}monster-slayer-calc)`,
        false);
    }

    return { embed };
  } catch (e) {
    console.error(e);
    return 'Unable to format monster slayer data.';
  }
};

const getHelpMessage = () =>
  helpMessage(
    'monster-slayer',
    'Used to get the level scores for the Monster Slayer Quest Event',
    '`!ql monster-slayer`',
    [],
    [
      '`!ql monster-slayer'
    ]
  );