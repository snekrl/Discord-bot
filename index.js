const ping = require('./commands/ping.js');
const { token, guildId, snekId } = require('./config.json');
const {Client, Events, GatewayIntentBits, SlashCommandBuilder, IntentsBitField, EmbedBuilder, Embed } = require("discord.js");

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

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === "queue"){
        const user = interaction.user;
        console.log(`${user.tag} joined the queue.`);
        await interaction.reply(`${user.globalName} joined the queue!`);

		const embed = new EmbedBuilder()
		.setTitle("Current queue")
		.setDescription(`Current number of players in queue ${user}`);
		.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		)
		interaction.reply({embeds: [embed]});

	}
});

client.on("interactionCreate", (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === "report"){
		const GameID = interaction.options.get(`id`).value;
		const GameResult = interaction.options.get(`result`).value;

		if (GameResult === "Won") {
			console.log("cool")
		}

		if (GameResult === "Lost") {
			console.log("cool")
		}
		
		if (GameID === "2") {
			console.log("cssssssssssssssssssssssssssss")
		}

		interaction.reply(`Game ${GameID} reported successfully!`);
	}
});

client.on("interactionCreate", (interaction)=> {
	if(!interaction.isChatInputCommand()) return;
	
	if (interaction.commandName === "embed") 
	{
		const embed = new EmbedBuilder()
		.setTitle("embed title")
		.setDescription("yes");

		interaction.reply({embeds: [embed]});
	}
});

client.on("interactionCreate", (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === "add"){
		const num1 = interaction.options.get(`n1`).value;
		const num2 = interaction.options.get(`n2`).value;

		interaction.reply(`the sum is ${num1 + num2}`);
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