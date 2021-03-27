const Discord = require("discord.js");
const fetch = require("node-fetch");
const {qlApiUrl} = require("../helpers/constants");
const {asyncHandler} = require("./_helper");

exports.command = 'gear-template';
exports.describe = 'Get a gear template from ThunderSoap\'s personal collection';
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
    temp = temp.filter(x => x !== 'gear-template');
    const gearTemplateName = temp.join(' ').toLowerCase();

    if (!gearCollectionWhitelist.includes(gearTemplateName)) {
        return getHelpMessage();
    }

    const response = await fetch(qlApiUrl + 'optimized-gear-templates/' + gearTemplateName);
    let gearTemplate = response.ok ? await response.json() : undefined;

    return gearTemplate ? printGearTemplate(gearTemplate) : getHelpMessage();
});

const gearCollectionWhitelist = ['beast-bb', 'ice-st', 'venom-pm', 'wind-et', 'myth-gota', 'noble-lc', 'hex-tp', 'abyss-dc'];

const printGearTemplate = (gearSet) => {
    try {
        const embed = new Discord.RichEmbed()
            .setTitle(`${gearSet.title}`)
            .setDescription('Important update: Starting in May Gamesture will be taking over the QL Bot, Public API, and Questland Handbook site. I have decided to extend my support through April so that no community member needs to go without for that period of time. Happy Questing!');

        if (gearSet.setsUsed) {
            embed.addField('Sets Used:', gearSet.setsUsed, false);
        }
        if (gearSet.notes) {
            embed.addField('Notes:', gearSet.notes, false);
        }
        if (gearSet.imageUrl) {
            embed.setImage(gearSet.imageUrl);
        } else {
            embed.addField('Restricted Access', 'Current gear set information  is limited to Legendary Tier+ patrons on ThunderSoap\'s discord. Once a new set is released, this gear template will be made available to all.', false)
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
        .setTitle('gear-template')
        .setDescription('Get a gear template from ThunderSoap\'s personal collection')
        .addField('Usage', `!ql gear-template <gear template option>`, false)
        .addField('Gear Template Options', [
            '`beast-bb` Beast Brawler - Beast Warrior Gear Template',
            '`ice-st` Sabertooth - Ice Warrior Gear Template',
            '`venom-pm` Poison Master - Venom Warrior Gear Template',
            '`wind-et` Evernight Troubadour - Wind Warrior Gear Template',
            '`myth-gota` Guardian of the Afterlife - Myth Warrior Gear Template',
            '`noble-lc` Lionheart Crusader - Noble Warrior Gear Template',
            '`hex-tp` Trickster Prince - Hex Warrior Gear Template',
            '`abyss-dc` Dread Captain - Abyss Warrior Gear Template',
        ], false)
        .addField('Examples', [
            '`!ql gear-template myth-gota` Get details for the Guardian of the Afterlife Myth Set Warrior Gear Template.'
        ], false);
    return richEmbed;
};
