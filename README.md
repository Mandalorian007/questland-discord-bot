# questland-discord-bot

This discord bot is backed by the questland public api 

# Status

This project is no longer in active development and should be considered
deprecated. Any changes made will be to support the existing production
deployment while it's still active. Any community developers who wish
to take over this project need only fork this repository and do not
need any special permission. I do request that credit for the original
work be acknowledged in any forked projects. If this project is to be
used for commercial means then please contact me first for approval.

## developers
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

### deployment:
- `gcloud app deploy app.yaml -v 1`