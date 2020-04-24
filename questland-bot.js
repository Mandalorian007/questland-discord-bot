const connect = require('connect');
const serveStatic = require('serve-static');
const yargs = require('yargs');
const Discord = require("discord.js");

const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values.
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

const parser = yargs
  .scriptName(config.prefix)
  .usage('$0 [command] [options]')
  .commandDir('commands')
  .demandCommand(1)
  .help(false)
  .showHelpOnFail(false)
  .showHelpOnFail(true)
  .version(false);

// Host a static file for health checks
const port = process.env.PORT || 3000;
connect().use(serveStatic('public')).listen(port, function () {
  console.log(`Server running on ${port}...`);
});

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
  const originalArgs = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${ m.createdTimestamp - message.createdTimestamp }ms. API Latency is ${ Math.round(client.ping) }ms`);

  } else {

    parser.parse(originalArgs, async (err, argv, output) => {
      if (argv.handled) {
        const result = await argv.handled;
        await message.channel.send(result).catch(console.error);
      } else {
        await message.channel.send(output);
      }
    });
  }
});

client.login(config.token);
