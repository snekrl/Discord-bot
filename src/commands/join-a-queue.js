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
    
    const queue = queues.get(id);
    const userId = interaction.user.id;

    if (!queue) {
      return interaction.reply({ content: `Queue #${id} doesn't exist or is inactive.`, ephemeral: true });
    }
    if (!queue.active) {
      return interaction.reply({ content: `Queue #${id} is closed and cannot be joined.`, ephemeral: true });
    }
    if (queue.users.includes(userId)) {
      return interaction.reply({ content: `You're already in queue #${id}.`, ephemeral: true });
    }
    if (queue.users.length >= queue.maxPlayers) {
      return interaction.reply({ content: `Queue #${id} is full.`, ephemeral: true });
    }

    queue.users.push(userId);

    const embed = new EmbedBuilder()
      .setTitle(`Queue #${id} (${queue.format})`)
      .setDescription(`Players: ${queue.users.length}/${queue.maxPlayers}`)
      .addFields([
        { 
          name: "Users", 
          value: queue.users.map((uid, i) => `${i + 1}. <@${uid}>`).join("\n") 
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
