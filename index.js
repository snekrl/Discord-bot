const ping = require('./commands/ping.js');
const { token, guildId, snekId } = require('./config.json');
const {Client, Events, GatewayIntentBits, SlashCommandBuilder, IntentsBitField } = require("discord.js");

const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds,
    	IntentsBitField.Flags.GuildMembers,
    	IntentsBitField.Flags.GuildMessages,
    	IntentsBitField.Flags.MessageContent,
	] });

client.once(Events.ClientReady, bot => {
	console.log(`logged in as ${bot.user.tag}`);
});

client.on("interactionCreate", (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === "queue"){
		interaction.reply("queue");
	}
});

client.on("messageCreate", (message) => {
	if (message.author.bot) return;
	if (message.content.toLowerCase().includes("siege")) {
		message.reply(`<@${snekId}>`);
	}
});

client.on("messageCreate", (message) => {
	if (message.author.bot) return;
	if (message.content.toLowerCase().includes("r6")) {
		message.reply(`<@${snekId}>`);
	}
});

client.login(token);