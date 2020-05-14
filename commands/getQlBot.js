const { asyncHandler } = require("./_helper");
const { helpMessage } = require("../helpers/messageHelper");
const Discord = require("discord.js");

exports.command = 'get-ql-bot';
exports.describe = 'Get QL Bot for your discord server';
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
      'get-ql-bot',
      'Used to get the instructions to add QL Bot to your own server',
      '`!ql get-ql-bot`',
      [],
      [
        '`!ql get-ql-bot` Get the details to add QL Bot to your server'
      ]
    );
  }

  return new Discord.RichEmbed()
    .setTitle(`Click here to invite QL Bot to your server!`)
    .setDescription('The only requirement is that you need to be the server admin.')
    .setURL('https://discordapp.com/oauth2/authorize?client_id=675765765395316740&scope=bot');
});
