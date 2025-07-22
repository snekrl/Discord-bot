const ping = require('./commands/ping');
const { token } = require('./config.json');
const { guildId } = require('./config.json');
const {Client, Events, GatewayIntentBits, SlashCommandBuilder } = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, bot => {
	console.log(`logged in as ${bot.user.tag}`);

	const ping = new SlashCommandBuilder()
		.setName("ping")
		.setDescription("pings the bot, replies with ping")
	
	const pingCommand = ping.toJSON();
	client.application.commands.create(pingCommand, guildId);
});

client.on(Events.InteractionCreate, Interaction => {
	if(!Interaction.isChatInputCommand()) return;
	if(Interaction.commandName === "ping"){
		Interaction.reply("pong");
	}
	console.log(Interaction)
})

client.login(token);