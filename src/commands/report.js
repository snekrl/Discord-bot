const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { queues } = require("../data/queues");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report")
    .setDescription("Report the result of a match")
    .addStringOption(option =>
      option
        .setName("id")
        .setDescription("Match ID")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption(option =>
      option
        .setName("result")
        .setDescription("Match result")
        .setRequired(true)
        .addChoices(
          { name: "Won", value: "Won" },
          { name: "Lost", value: "Lost" },
        )
    ),

  async execute(interaction) {
    try {
      const idString = interaction.options.getString("id");
      const id = parseInt(idString);
      const result = interaction.options.getString("result");
      const queue = queues.get(id);
      const userId = interaction.user.id;

      if (!queue) {
        return interaction.reply({ content: `Match ID #${id} doesn't exist or is inactive.`, ephemeral: true });
      }

      if (!queue.active) {
        return interaction.reply({ content: `Match #${id} has been closed and can no longer be reported.`, ephemeral: true });
      }

      if (!queue.users.includes(userId)) {
        return interaction.reply({ content: `You're not in match #${id}.`, ephemeral: true });
      }

      queue.active = false;

      await interaction.reply({ content: `You reported match #${id} as **${result}**. This match is now closed.` });
    } catch (error) {
      console.error('Error in report command:', error);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: 'Failed to report the match.', ephemeral: true });
      } else {
        await interaction.followUp({ content: 'Failed to report the match.', ephemeral: true });
      }
    }
  },

  autocomplete: async (interaction) => {
    try {
      const focused = interaction.options.getFocused();
      const choices = Array.from(queues.entries())
        .filter(([id, queue]) => queue.active)
        .map(([id]) => id.toString());
      const filtered = choices.filter(id => id.startsWith(focused)).slice(0, 25);

      await interaction.respond(
        filtered.map(id => ({ name: `Queue #${id}`, value: id }))
      );
    } catch (error) {
      console.error('Autocomplete error in report.js:', error);
      try {
        await interaction.respond([]);
      } catch (_) {}
    }
  }
};
