const Discord = require("discord.js");
const { asyncHandler } = require("./_helper");
const { qlBotUrl } = require("../helpers/constants");

exports.command = 'compensation';
exports.describe = 'Bob has it... we all need it.';
exports.builder = (yargs) => {
  return yargs
    .option('h', {
      alias: 'help',
      demandOption: false,
      describe: 'Show Help'
    })
};

exports.handler = asyncHandler(async (argv) => {
  return new Discord.MessageEmbed()
    .setTitle('BOB GIMME')
    .setImage(`${qlBotUrl}bobgimme.png`);
});