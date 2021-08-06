const { asyncHandler } = require("./_helper");
const Discord = require("discord.js");

exports.command = '$0';
exports.describe = 'Default Help';
exports.builder = {};

exports.handler = asyncHandler(async (argv) => {
  return new Discord.MessageEmbed()
    .setTitle('QL Bot command list')
    .setDescription('For any command just add `-h` or `--help` Ex: ```!ql item --help```')
    .addField(':card_box: Index Data', ['`item`', '`orb`'], true)
    .addField(':flower_playing_cards: Profile Lookups', ['`guild`', '`hero`'], true)
    .addField(':crossed_swords: Community Builds', ['`build`', '`gear-template`', '`daily-boss`'], true)
    .addField(':tools: Community Tools', ['`monster-slayer`', '`hall-of-fame`', '`guild-ranking`'], true)
    .addField(':information_source: Info', ['`about`'], true);
});
