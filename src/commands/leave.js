const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { queues } = require("../data/queues");

function resetQueueTimeout(queue) {
  if (queue.timeout) clearTimeout(queue.timeout);

  queue.timeout = setTimeout(() => {
    queues.delete(queue.id);
    console.log(`Queue #${queue.id} deleted due to inactivity.`);
  }, 10 * 60 * 1000); // 10 minutes
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leave a queue")
    .addStringOption(option =>
      option
        .setName("id")
        .setDescription("Queue ID")
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async execute(interaction) {
    const idString = interaction.options.getString("id");
    const id = parseInt(idString);

    if (isNaN(id)) {
      return interaction.reply({ content: "Invalid queue ID.", ephemeral: true });
    }

    const queue = queues.get(id);
    const userId = interaction.user.id;

    if (!queue) {
      return interaction.reply({ content: `Queue #${id} doesn't exist or is inactive.`, ephemeral: true });
    }

    if (!queue.active) {
      return interaction.reply({ content: `Queue #${id} is closed and you cannot leave it anymore.`, ephemeral: true });
    }

    if (!queue.users.includes(userId)) {
      return interaction.reply({ content: `You are not in queue #${id}.`, ephemeral: true });
    }

    queue.users = queue.users.filter(uid => uid !== userId);

    if (queue.users.length === 0) {
      if (queue.timeout) clearTimeout(queue.timeout);
      // Mark as inactive before deletion for clarity (optional)
      queue.active = false;
      queues.delete(queue.id);
      console.log(`Queue #${queue.id} deleted because it's empty.`);
    } else {
      resetQueueTimeout(queue);
    }

    const embed = new EmbedBuilder()
      .setTitle(`Queue #${id} (${queue.format})`)
      .setDescription(`You left the queue!`);

    await interaction.reply({
      content: `<@${userId}> has left queue #${id}.`,
      embeds: [embed],
    });
  },

  autocomplete: async (interaction) => {
    const focused = interaction.options.getFocused();
    const choices = Array.from(queues.entries())
      .filter(([id, queue]) => queue.active)
      .map(([id]) => id.toString());
    const filtered = choices.filter(id => id.startsWith(focused)).slice(0, 25);

    await interaction.respond(
      filtered.map(id => ({ name: `Queue #${id}`, value: id }))
    );
  }
};
