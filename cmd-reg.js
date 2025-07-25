const { token, guildId, clientId } = require('./config.json');
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js")

const commands = [
    {
        name: "queue",
        description: "Join the queue",
    },

    {
        name: "report",
        description: "Report the score",
        options: [
            {
                name: "id",
                description: "Input the match ID that you want to report.",
                type: ApplicationCommandOptionType.Number,
                required: true,
            },
            {
                name: "result",
                description: "Select if you won or lost the match.",
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: "Won",
                        value: "Won",
                    },
                    {
                        name: "Lost",
                        value: "Lost",
                    },
                ],
                required: true,
            },
        ],
    },


    {
        name: "add",
        description: "adds 2 numbers",
        options: [
            {
                name: "n1",
                description: "the first",
                type: ApplicationCommandOptionType.Number,
                choices: [
                    {
                        name: "one",
                        value: 1,
                    },
                ],
                required: true,
            },
            {
                name: "n2",
                description: "the ssnknd n",
                type: ApplicationCommandOptionType.Number,
                choices: [ 
                    {
                        name: "two",
                        value: 2,
                    },
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