import { MessageFlags } from "discord.js";

export default {
  name: "ping",
  description: "Replies with bot latency",
  // devOnly: Boolean,
  // testOnly: Boolean,
  // options: Object[]

  callback: async (client, interaction) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const reply = await interaction.fetchReply();
    const ping = reply.createdTimestamp - interaction.createdTimestamp;

    interaction.editReply(`Pong! ${ping}ms`);
  },
};
