const Discord = require("discord.js");

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

// Discord message "unknown option value"
exports.unknownServerMessage = (option, optionAlias, submitted, allowedValues) =>
  new Discord.RichEmbed()
    .setTitle(`Unable able parse: ${option}(${optionAlias})`)
    .addField('You sent:', `${submitted}`)
    .addField('Available Options:', `${allowedValues.join(', ')}`)
    .setThumbnail('https://questland-discord-bot.cfapps.io/noidea.png');