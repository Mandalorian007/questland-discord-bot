#!/usr/bin/env node
const yargs = require('yargs');

const parser = yargs
  .scriptName('!ql')
  .usage('$0 [command] [options]')
  .commandDir('commands')
  .demandCommand(1)
  .help()
  .alias('h', 'help')
  .showHelpOnFail(true)
  .version(false);


parser.parse(['item', 'hecatombus'], async (err, argv, output) => {
  if (argv.handled) {
    const result = await argv.handled;
    console.log('GOT A RESULT:\n', result);
  } else {
    console.log('THIS IS HELP:\n', output);
  }
});