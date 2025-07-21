const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('pings le bot'),
    async execute(interaction) {
        await interaction.reply(`pong bitchass ${interaction.user.name}`);
    },
};


