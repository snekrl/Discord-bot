const { token } = require('./config.json');
const {Client, Events, GatewayIntentBits } = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, bot => {
	console.log(`logged in as ${bot.user.tag}`);
});


client.login(token);