const Discord = require("discord.js");

exports.asyncHandler = (cb) => (argv) => {
  argv.handled = cb(argv);
};

// Discord message "multiple items found"
exports.multipleResultsFoundMessage = (searchTerm, suggestions) =>
  new Discord.RichEmbed()
    .setTitle(`Multiple results for '${searchTerm}'`)
    .addField('Did you mean:', `${suggestions}`)
    .setThumbnail('https://questland-discord-bot.cfapps.io/sherlock.png');

// Discord message "no item results found"
exports.noResultFoundMessage = (searchTerm, searchCategory) =>
  new Discord.RichEmbed()
    .setTitle(`${searchCategory} '${searchTerm}' not found`)
    .addField('Please check your input', '\u200b')
    .setThumbnail('https://questland-discord-bot.cfapps.io/noidea.png');
