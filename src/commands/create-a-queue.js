const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { queues, generateUniqueQueueID } = require("../data/queues");

function resetQueueTimeout(queue) {
  if (queue.timeout) clearTimeout(queue.timeout);

  queue.timeout = setTimeout(() => {
    queues.delete(queue.id);
    console.log(`Queue #${queue.id} deleted due to inactivity.`);
  }, 10 * 60 * 1000); // 10 minutes
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create-a-queue")
    .setDescription("Create a queue")
    .addStringOption(option =>
      option
        .setName("format")
        .setDescription("Select the match format")
        .setRequired(true)
        .addChoices(
          { name: "10 Mans", value: "10 Mans" },
          { name: "6 Mans", value: "6 Mans" },
          { name: "4 Mans", value: "4 Mans" }
        )
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply();

      const format = interaction.options.getString("format");
      const userId = interaction.user.id;
      const id = generateUniqueQueueID();

      let maxPlayers;
      switch (format) {
        case "10 Mans": maxPlayers = 10; break;
        case "6 Mans": maxPlayers = 6; break;
        case "4 Mans": maxPlayers = 4; break;
        default: maxPlayers = 10;
      }

      const queue = {
        id,
        format,
        maxPlayers,
        users: [userId],
        active: true, // New queue is active by default
      };

      queues.set(id, queue);
      resetQueueTimeout(queue);

      const embed = new EmbedBuilder()
        .setTitle(`Queue #${id} (${format})`)
        .setDescription(`Queue created! You have been added as the first player.`)
        .addFields([
          {
            name: "Current players in the queue",
            value: `<@${userId}>`,
          }
        ]);

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error(error);

      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: "There was an error executing this command.",
          ephemeral: true,
        }).catch(console.error);
      } else {
        console.warn("Failed after already acknowledging interaction.");
      }
    }
  },
};
