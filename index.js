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

	const ping = new SlashCommandBuilder()
		.setName("ping")
		.setDescription("pings the bot, replies with pong")
	
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