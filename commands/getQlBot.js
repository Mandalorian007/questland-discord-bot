const { asyncHandler } = require("./_helper");

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
    return`Usage: !ql get-ql-bot [options]

Commands:
  !ql get-ql-bot  Get QL Bot on your server

Options:
  -h, --help      Show help                                [boolean]

Examples:
  !ql get-ql-bot     Get details about how to get QL Bot on your discord server
`
  }

  return `You can add QL Bot to any discord server you want!
The only requirement is that you need to have a server admin invite QL Bot from this link:
https://discordapp.com/oauth2/authorize?client_id=675765765395316740&scope=bot
`;
});
