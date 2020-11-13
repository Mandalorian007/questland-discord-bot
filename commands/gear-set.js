const Discord = require("discord.js");
const fetch = require("node-fetch");
const {qlApiUrl} = require("../helpers/constants");
const {asyncHandler} = require("./_helper");

exports.command = 'gear-set';
exports.describe = 'Get a gear set from ThunderSoap\'s personal collection';
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
        return getHelpMessage();
    }

    let temp = argv._;
    temp = temp.filter(x => x !== 'gear-set');
    const gearSetName = temp.join(' ').toLowerCase();

    if (!gearCollectionWhitelist.includes(gearSetName)) {
        return getHelpMessage();
    }

    const response = await fetch(qlApiUrl + 'optimized-gear-sets/' + gearSetName);
    let gearSet = response.ok ? await response.json() : undefined;

    return gearSet ? printGearSet(gearSet) : getHelpMessage();
});

const gearCollectionWhitelist = ['wind-et', 'myth-gota', 'noble-lc', 'hex-tp', 'abyss-dc'];

const printGearSet = (gearSet) => {
    try {
        const embed = new Discord.RichEmbed()
            .setTitle(`${gearSet.title}`)
            .setDescription('Love QL Bot? Please consider supporting me on [Patreon](https://www.patreon.com/thundersoap)' +
                '\n----------------------------------------------------------------');

        if (gearSet.setsUsed) {
            embed.addField('Sets Used:', gearSet.setsUsed, false);
        }
        if (gearSet.notes) {
            embed.addField('Notes:', gearSet.notes, false);
        }
        if (gearSet.imageUrl) {
            embed.setImage(gearSet.imageUrl);
        } else {
            embed.addField('Restricted Access', 'Current gear set information  is limited to Legendary Tier+ patrons on ThunderSoap\'s discord. Once a new set is released, this gear set will be made available to all.', false)
        }

        return {embed};
    } catch (e) {
        console.error(e);
        return 'Unable to format gear set data.';
    }
};

const getHelpMessage = () => {
    const richEmbed = new Discord.RichEmbed();
    richEmbed
        .setTitle('gear-set')
        .setDescription('Get a gear set from ThunderSoap\'s personal collection')
        .addField('Usage', `!ql gear-set <gear set option>`, false)
        .addField('Gear Set Options', [
            '`wind-et` Evernight Troubadour - Wind Warrior Gear Set',
            '`myth-gota` Guardian of the Afterlife - Myth Warrior Gear Set',
            '`noble-lc` Lionheart Crusader - Noble Warrior Gear Set',
            '`hex-tp` Trickster Prince - Hex Warrior Gear Set',
            '`abyss-dc` Dread Captain - Abyss Warrior Gear Set',
        ], false)
        .addField('Examples', [
            '`!ql gear-set myth-gota` Get details for the Guardian of the Afterlife Myth Set Warrior Gear Set.'
        ], false);
    return richEmbed;
};
