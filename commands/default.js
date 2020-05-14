const { asyncHandler } = require("./_helper");
const Discord = require("discord.js");

exports.command = '$0';
exports.describe = 'Default Help';
exports.builder = {};

exports.handler = asyncHandler(async (argv) => {
  return new Discord.RichEmbed()
    .setTitle('QL Bot command list')
    .setDescription('For any command just add `-h` or `--help` Ex: ```!ql item --help```')
    .addField(':card_box: Index Data', ['`item`', '`orb`'], true)
    .addField(':flower_playing_cards: Profile Lookups', ['`guild`', '`hero`'], true)
    .addField(':tools: Community Tools', ['`build`', '`daily-boss`'], true)
    .addField(':information_source: Info', ['`about`', '`get-ql-bot`'], true);
});
