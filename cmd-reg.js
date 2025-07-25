const { token, guildId, clientId } = require('./config.json');
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js")

const commands = [
    {
        name: "create-a-queue",
        description: "Create a queue",
        options: [{
                name: "format",
                description: "Select the match format",
                type: ApplicationCommandOptionType.String,
                choices: [
                { name: "10 Mans", value: "10 Mans" },
                { name: "6 Mans", value: "6 Mans" },
                { name: "4 Mans", value: "4 Mans" },
                { name: "1 Mans", value: "1 Mans" },
                ],
                required: true,
            },
        ],
    },
    {
        name: "join-a-queue",
        description: "Join an active queue",
        options: [
            {
                name: "id",
                description: "select or enter which queue you want to join",
                type: ApplicationCommandOptionType.Integer,
                required: true,
                autocomplete: true
            },
        ],
    },

    {
        name: "report",
        description: "Report the score",
        options: [
            {
                name: "id",
                description: "Input the match ID that you want to report.",
                type: ApplicationCommandOptionType.Integer,
                required: true,
                autocomplete: true
            },
            {
                name: "result",
                description: "Select if you won or lost the match.",
                type: ApplicationCommandOptionType.String,
                choices: [
                { name: "Won", value: "Won" },
                { name: "Lost", value: "Lost" },
                ],
                required: true,
            },
        ],
    },
];

const rest = new REST({ version: "10"}).setToken(token);

(async () => {
    try {
        console.log("registering slash commands");

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        );

        console.log("slash commands work");
    } catch (error){
        console.log(`there was an error at ${error}`);
    }
})();