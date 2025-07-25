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

const queue = [];
client.on("interactionCreate", async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === "queue") {
        const user = interaction.user;

        if (queue.includes(user.id)) {
            await interaction.reply({
                content: `${user.globalName || user.username}, you're already in the queue!`,
                ephemeral: true
            });
            return;
        }

        queue.push(user.id);
        console.log(`${user.tag} joined the queue.`);

        const queueList = queue.map((id, index) => `${index + 1}. <@${id}>`).join("\n");

        const embed = new EmbedBuilder()
            .setTitle("Current Queue")
            .setDescription(`Total players in queue: ${queue.length}`)
            .addFields({ name: 'Players currently in Queue', value: queueList });

        await interaction.reply({
            content: `${user.globalName || user.username} joined the queue!`,
            embeds: [embed]
        });
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