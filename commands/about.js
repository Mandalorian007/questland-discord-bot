const { asyncHandler } = require("./_helper");
const Discord = require("discord.js");
const { helpMessage } = require("../helpers/messageHelper");
const { qlApiUrl } = require("../helpers/constants");

exports.command = 'about';
exports.describe = 'Get details about QL Bot';
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
    return helpMessage(
      'about',
      'Used to get the details about the QL Bot.',
      '`!ql about`',
      [],
      [
        '`!ql about` Get details for the QL Bot'
      ]
    );
  }

  return new Discord.MessageEmbed()
    .setTitle('About QL Bot')
    .setDescription('QL Bot is one of many community tools made by ThunderSoap')
    .addField('Bug Reports','If you find any bugs please reach out to ThunderSoap on the [Questland public discord](https://discord.com/invite/questland)', false)
    .addField('Add QL Bot to your server','Just have your server admin go to this link: [QL Bot Server Add](https://discordapp.com/oauth2/authorize?client_id=675765765395316740&scope=bot)', false)
    .addField('Other ThunderSoap Community projects',[
      '[ThunderSoap\'s YouTube Questland Guides](https://www.youtube.com/channel/UCLHjCEBoRj-PGCPvmWzQXMQ) - This is a channel for YouTube content to help everyone learn about Questland',
      '[Questland Handbook](https://questland-handbook.com) - This is a community guide website designed to help everyone learn about Questland',
      `[Public Questland API](${qlApiUrl}swagger-ui.html) - This is a public API for Questland that developer can make QL tools with. Please reach out to ThunderSoap before hitting it with anything too crazy :grin:`
    ], false)
});
