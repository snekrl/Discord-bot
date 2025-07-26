const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { queues } = require("../data/queues");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join-a-queue")
    .setDescription("Join a queue by ID")
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
    
    const newQueue = queues.get(id);
    const userId = interaction.user.id;

    if (!newQueue) {
      return interaction.reply({ content: `Queue #${id} doesn't exist or is inactive.`, ephemeral: true });
    }
    if (!newQueue.active) {
      return interaction.reply({ content: `Queue #${id} is closed and cannot be joined.`, ephemeral: true });
    }
    if (newQueue.users.includes(userId)) {
      return interaction.reply({ content: `You're already in queue #${id}.`, ephemeral: true });
    }
    if (newQueue.users.length >= newQueue.maxPlayers) {
      return interaction.reply({ content: `Queue #${id} is full.`, ephemeral: true });
    }

    for (const [otherId, queue] of queues.entries()) {
      if (queue.id !== id && queue.active && queue.users.includes(userId)) {
        queue.users = queue.users.filter(uid => uid !== userId);

        if (queue.users.length === 0) {
          queue.active = false;
          queues.delete(queue.id);
          console.log(`Queue #${queue.id} deleted after becoming empty from a switch.`);
      }
      break;
    }
  }

    newQueue.users.push(userId);

    const embed = new EmbedBuilder()
      .setTitle(`Queue #${id} (${newQueue.format})`)
      .setDescription(`Players: ${newQueue.users.length}/${newQueue.maxPlayers}`)
      .addFields([
        { 
          name: "Users", 
          value: newQueue.users.map((uid, i) => `${i + 1}. <@${uid}>`).join("\n") 
        }
      ]);

    await interaction.reply({ content: `<@${userId}> joined queue #${id}`, embeds: [embed] });
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
