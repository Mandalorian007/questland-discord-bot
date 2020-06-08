const Discord = require("discord.js");
const { asyncHandler } = require("./_helper");

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
  return new Discord.RichEmbed()
    .setTitle('BOB GIMME')
    .setImage('https://questland-discord-bot.cfapps.io/bobgimme.png');
});