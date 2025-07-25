const { REST, Routes } = require('discord.js');
const { readdirSync } = require('fs');
const path = require('path');
const { token, clientId, guildId } = require('./config.json');

const commands = [];
const commandsPath = path.join(__dirname, 'src', 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    } else {
        console.warn(`The command at ${filePath} is missing required "data" or "execute".`);
    }
}

if (commands.length === 0) {
    console.warn('No commands found to register.');
    process.exit(0);
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log(`Registering ${commands.length} slash command(s) to guild ${guildId}...`);

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Commands registered successfully!');
    } catch (error) {
        console.error('Failed to register commands:', error);
    }
})();
