const Discord = require("discord.js");
const fetch = require("node-fetch");
const { asyncHandler } = require("./_helper");
const { serverMatcher, serverOptions } = require("../helpers/optionHelper");
const { optionNotFoundMessage, helpMessage } = require("../helpers/messageHelper");

exports.command = 'guild';
exports.describe = 'Get details about a guild';
exports.builder = (yargs) => {
  return yargs
    .option('s', {
      alias: 'server',
      demandOption: false,
      describe: 'Choose a server for the today command.'
    })
    .option('h', {
      alias: 'help',
      demandOption: false,
      describe: 'Show Help'
    })
};

exports.handler = asyncHandler(async (argv) => {
  if (argv.h) {
    return helpMessage(
      'guild',
      'Used to get the details for a guild on any Questland Server!',
      '`!ql guild <guild name> [options]`',
      [
        '`-s, --server` This option is for selecting a server for the guild. [choices:  `global`, `europe`, `america`, `asia`, `veterans`]'
      ],
      [
        '`!ql guild RedruM -s global` Get details about the guild RedruM on the global server.'
      ]
    );
  }

  let temp = argv._;
  temp = temp.filter(x => x !== 'guild');
  const guildName = temp.join(' ');
  let server;
  if (serverMatcher(argv.s)) {
    server = argv.s.toUpperCase();
  } else {
    return optionNotFoundMessage('s', 'server', argv.s, serverOptions)
  }

  const response = await fetch(`https://questland-public-api.cfapps.io/guild/${ encodeURI(guildName) }?server=${ server }`);
  const guild = response.ok
    ? await response.json()
    : null;

  if (!guild) {
    return `Unable to locate a guild for name: ${ guildName } on server: ${ server.toLowerCase() }`;
  } else {
    return printGuild(guild);
  }
});

const printGuild = (guild) => {
  let guildMaster = '';
  let officers = 'No officers found.';
  if (guild.guildMembers) {
    let temp =
      guild.guildMembers.filter(member => !member.guildRank.localeCompare('owner'))
    guildMaster = temp[0].name
    temp =
      guild.guildMembers
        .filter(member => !member.guildRank.localeCompare('officer'))
        .map(member => member.name)
    if (temp.length > 1) {
      officers = temp;
    }
  }

  try {
    const embed = new Discord.RichEmbed()
      .setTitle(`${ guild.name }`)
      .setURL('https://questland-handbook.cfapps.io/tools/guild-lookup')
      .addField('Server', guild.server, false)
      .addField('Guild Master', guildMaster, false)
      .addField('Description', guild.description || guild.description.length > 0 ? guild.description : 'no description', false)
      .addField('Level', guild.level, false)
      .addField('Members', `${ guild.currentMemberCount } / ${ guild.maximumMemberCount }`, true)
      .addField('Research (atk, def, hp, mag)',
        `${ guild.attackResearchLevel }, ${ guild.defenseResearchLevel }, ${ guild.healthResearchLevel }, ${ guild.magicResearchLevel }`,
        false)
      .addField('Officers', officers, false)
      .setThumbnail('https://questland-discord-bot.cfapps.io/guild.png')
      .setFooter('Love QL Bot? Check out the about command for more good stuff!',
        'https://questland-discord-bot.cfapps.io/ql_weasel.png');
    return { embed };
  } catch (e) {
    console.error(e);
    return 'Unable to format guild data.';
  }
};
