# questland-discord-bot

This discord bot is backed by the questland public api 

Future desires:
- Autocomplete for item & orbs



Running locally requires NPM and Node installed as well as the following dependencies:
```
npm install discord.js
npm install yargs
npm install serve-static
npm install connect
npm install node-cache
```

You will also need a config named `config.json` in the root directory of the project which isn't 
checked in by default.
```json
{
  "token": "SECRET BOT TOKEN",
  "prefix": "!<BOT-PREFIX>"
}
```

The command to start the bot is: `node questland-bot.js`