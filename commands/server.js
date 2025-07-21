const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("server"),
    async execute(interaction) {
        await interaction.reply(`this is ${interaction.guild.name}`);
    },
};