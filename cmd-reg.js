const { token, guildId, clientId } = require('./config.json');
console.log("TOKEN is:", token);
const { REST, Routes } = require("discord.js")

const commands = [
    {
        name: "hey",
        description: "replies with hey",
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