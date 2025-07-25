
const { token, guildId, clientId } = require('./config.json');
const {Client, Events, GatewayIntentBits, SlashCommandBuilder, IntentsBitField, EmbedBuilder, Embed, REST, Routes } = require("discord.js");

const rest = new REST({ version: "10"}).setToken(token);

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ] });



client.on("messageCreate", (message) => {
	if (message.author.bot) return;
	    if (message.content.toLowerCase().includes("siege")) {
	message.reply(`<@${snekId}>`);
	}
}),

client.on("messageCreate", (message) => {
	if (message.author.bot) return;
	if (message.content.toLowerCase().includes("r6")) {
		message.reply(`<@${snekId}>`);
	}
});