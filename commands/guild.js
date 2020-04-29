const Discord = require("discord.js");
const fetch = require("node-fetch");
const { asyncHandler } = require("./_helper");

exports.command = 'guild';
exports.describe = 'Get details about a guild';
exports.builder = (yargs) => {
  return yargs
    .option('s', {
      alias: 'server',
      demandOption: true,
      describe: 'Choose a server for the today command.',
      choices: ['global', 'america', 'europe', 'asia', 'veterans']
    })
    .option('h', {
      alias: 'help',
      demandOption: false,
      describe: 'Show Help'
    })
};

exports.handler = asyncHandler(async (argv) => {
  if (argv.h) {
    return `Usage: !ql guild <boss name> [options]

Commands:
  !ql guild RedruM -s global  Get the RedruM guild's details from the global server.

Options:
  -h, --help      Show help                                [boolean]
  -s, --server    Select server for the Today option       [choices: 'global', 'europe', 'america', 'asia', 'veterans']

Examples:
  !ql guild RedruM -s global  Get the RedruM guild's details from the global server.
`
  }

  let temp = argv._;
  temp = temp.filter(x => x !== 'guild');
  const guildName = temp.join(' ');
  const server = argv.s.toUpperCase();

  const response = await fetch(`https://questland-public-api.cfapps.io/guild/${ guildName }?server=${ server }`);
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
      .addField('Server', guild.server, false)
      .addField('Guild Master', guildMaster, false)
      .addField('Description', guild.description || guild.description.length > 0 ? guild.description : 'no description', false)
      .addField('Level', guild.level, false)
      .addField('Members', `${ guild.currentMemberCount } / ${ guild.maximumMemberCount }`, false)
      .addField('Research (atk, def, hp, mag)',
        `${ guild.attackResearchLevel }, ${ guild.defenseResearchLevel }, ${ guild.healthResearchLevel }, ${ guild.magicResearchLevel }`,
        false)
      .addField('Officers', officers, false)
    return { embed };
  } catch (e) {
    console.error(e);
    return 'Unable to format guild data.';
  }
};
