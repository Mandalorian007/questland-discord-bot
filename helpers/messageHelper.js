const Discord = require("discord.js");

// Discord message "multiple items found"
exports.multipleResultsFoundMessage = (searchTerm, suggestions) =>
  new Discord.RichEmbed()
    .setTitle(`Multiple results for '${ searchTerm }'`)
    .addField('Did you mean:', `${ suggestions }`)
    .setThumbnail('https://questland-discord-bot.cfapps.io/sherlock.png');

// Discord message "no item results found"
exports.noResultFoundMessage = (searchTerm, searchCategory) =>
  new Discord.RichEmbed()
    .setTitle(`${ searchCategory } '${ searchTerm }' not found`)
    .addField('Please check your input', '\u200b')
    .setThumbnail('https://questland-discord-bot.cfapps.io/noidea.png');

// Discord message "unknown option value"
exports.optionNotFoundMessage = (option, optionAlias, submitted, allowedValues) => {
  let richEmbed = new Discord.RichEmbed()
    .setTitle(`Unknown option for: ${ option }, ${ optionAlias }`)
    .setDescription('This option needs to be provided to run your command.')
    .setThumbnail('https://questland-discord-bot.cfapps.io/confused.png');

  if(allowedValues.length > 0) {
    richEmbed
      .addField('You sent:', `${ submitted }`)
      .addField('Available Options:', `${ allowedValues.join(', ') }`)
  }
  richEmbed.addField('Confused?', 'Try adding `--help` to the end of any command');
  return richEmbed;
};

// /Discord message "help command"
exports.helpMessage = (commandTitle, commandDescription, usage, options, examples) => {
  const richEmbed = new Discord.RichEmbed();
  richEmbed
    .setTitle(commandTitle)
    .setDescription(commandDescription)
    .addField('Usage', usage, false);

  if (options.length > 0) {
    richEmbed.addField('Options', options, false)
  }
  richEmbed.addField('Examples', examples, false);
  return richEmbed;
}