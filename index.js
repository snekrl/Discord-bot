const { Client, Events, GatewayIntentBits, IntentsBitField, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { token } = require("./config.json");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

client.once(Events.ClientReady, bot => {
    console.log(`Logged in as ${bot.user.tag}`);
});

function generateUniqueQueueID() {
    let id;
    do {
        id = Math.floor(10000 + Math.random() * 90000);
    } while (queues.has(id));
    return id;
}

const queues = new Map();

client.on("interactionCreate", async (interaction) => {
    if (interaction.isChatInputCommand()) {
        const { commandName, options, user } = interaction;
        const format = options.getString("format");

        // /create-a-queue
        if (commandName === "create-a-queue") {
            const format = options.getString("format");
            const queueID = generateUniqueQueueID();

            let maxPlayers = 10;
            if (format === "1 Mans") maxPlayers = 1;
            if (format === "10 Mans") maxPlayers = 10;
            if (format === "6 Mans") maxPlayers = 6;
            if (format === "4 Mans") maxPlayers = 4;

            queues.set(queueID, {
                format,
                users: [],
                users: [user.id],
            });

			const queue = queues.get(queueID).users;

			const embed = new EmbedBuilder()
                .setTitle(`Queue #${queueID} (${format})`)
                .setDescription(`Total players: ${users.length}`)
                .addFields({
                    name: "Current players in the queue",
                    value: users.map((uid) => `<@${uid}>`).join(),
                });
			
			await interaction.reply({
					content: `Queue #${queueID} created (${format})`,
        			embeds: [embed],
			});
        }

        // /join-a-queue
        else if (commandName === "join-a-queue") {
            const queueID = options.getInteger("id");
            const queue = queues.get(queueID);

            if (!queue) {
                await interaction.reply({ content: `Queue #${queueID} doesn't exist.`, ephemeral: true });
                return;
            }

            if (queue.users.includes(user.id)) {
                await interaction.reply({ content: `You are already in this queue #${queueID}!`, ephemeral: true });
                return;
            }

            if (queue.users.length >= queue.maxPlayers) {
                await interaction.reply({ content: `Queue #${queueID} is full!)`, ephemeral: true });
                return;
            }

            queue.users.push(user.id);


            const embed = new EmbedBuilder()
                .setTitle(`Queue #${queueID} (${queue.format})`)
                .setDescription(`Total players: ${queue.users.length}`)
                .addFields({
                    name: "Current players in the queue",
                    value: queue.users.map((uid, i) => `${i + 1}. <@${uid}>`).join("\n")
                });

            await interaction.reply({
                content: `<@${user.id}> joined queue #${queueID}`,
                embeds: [embed],
            });
        }

        // /report
        else if (commandName === "report") {
            const GameID = options.getInteger("id");
            const GameResult = options.getString("result");

            if (GameResult === "Won") console.log("User won the game.");
            if (GameResult === "Lost") console.log("User lost the game.");

            await interaction.reply(`Game ${GameID} reported as **${GameResult}**.`);

            const embed = new EmbedBuilder()
                .setTitle(`Queue #${queueID} (${queue.format})`)
                .setDescription(`Game report.`)
                .addFields({
                    name: "Result:",
                    value: "test"
                });

            await interaction.reply({
                content: `Game #${GameID} has been reported.`,
                embeds: [embed],
            });
        }
    }

    // Autocomplete handler
    else if (interaction.isAutocomplete()) {
        const focused = interaction.options.getFocused();
        const choices = [...queues.entries()].map(([queueID, q]) => ({
            name: `#${queueID} (${q.format})`,
            value: queueID,
        }));

        const filtered = choices.filter(choice =>
            choice.name.toLowerCase().includes(focused.toString())
        );

        await interaction.respond(filtered.slice(0, 5));
    }
});

client.login(token);
