const connect = require('connect');
const serveStatic = require('serve-static');
const fetch = require("node-fetch");

// Host a static file for health checks
connect().use(serveStatic(__dirname)).listen(process.env.PORT || 3000, function () {
  console.log('Server running on 8080...');
});


const Discord = require("discord.js");

const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values.
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${ client.users.size } users, in ${ client.channels.size } channels of ${ client.guilds.size } guilds.`);
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`Serving ${ client.guilds.size } servers`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${ guild.name } (id: ${ guild.id }). This guild has ${ guild.memberCount } members!`);
  client.user.setActivity(`Serving ${ client.guilds.size } servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${ guild.name } (id: ${ guild.id })`);
  client.user.setActivity(`Serving ${ client.guilds.size } servers`);
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.

  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot) return;

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file.
  if (message.content.indexOf(config.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();


  if (command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${ m.createdTimestamp - message.createdTimestamp }ms. API Latency is ${ Math.round(client.ping) }ms`);
  }

  if (command === "item") {
    // Prints details about a specific questland item by leveraging the public api

    // extract any flags in args
    let flags = [];
    args.forEach(arg => {
      if (arg.startsWith('-')) {
        flags.push(arg);
      }
    });

    // filter flags from args
    const cleanArgs = args.filter((arg) => !flags.includes(arg));

    if (flags.length >1) {
      await message.channel.send('Too many flags.');
    } else {
      const itemName = cleanArgs.join(" ");
      console.log(`Resolving details for item: ` + itemName);

      let param = '';
      if (flags.length === 1) {
        switch (flags[0].toUpperCase()) {
          case '-ARTIFACT1':
            param = '?quality=ARTIFACT1';
            break;
          case '-ARTIFACT2':
            param = '?quality=ARTIFACT2';
            break;
          case '-ARTIFACT3':
            param = '?quality=ARTIFACT3';
            break;
          case '-ARTIFACT4':
            param = '?quality=ARTIFACT4';
            break;
          default:
            param = 'bad';
        }
      }

      if (param === 'bad') {
        await message.channel.send('invalid parameter');
      } else {
        let url = 'https://questland-public-api.cfapps.io/items/name/'
          + encodeURIComponent(itemName)
          + param;
        fetch(url)
          .then((response) => {
            if (response.ok) {
              response.json().then(itemJson => {
                let itemPrint = printItem(itemJson);
                message.channel.send(itemPrint);
              });
            } else {
              message.channel.send('Unable to locate item.');
            }
          });
      }
    }


  }
});

const printItem = (item) => {
  try {
    return item.name
      + '\nPotential (atk, mag, def, hp): ' + item.totalPotential
      + ' (' + item.attackPotential
      + ', ' + item.magicPotential
      + ', ' + item.defensePotential
      + ', ' + item.healthPotential + ')'
      + '\nQuality: ' + item.quality
      + '\nEmblem: ' + item.emblem
      + '\nItem Slot: ' + item.itemSlot
      + '\nStats (atk, mag, def, hp): '
      + item.attack
      + ', ' + item.magic
      + ', ' + item.defense
      + ', ' + item.health;
  } catch (e) {
    console.error(e);
    return 'Unable to locate item.'
  }
};

client.login(config.token);
