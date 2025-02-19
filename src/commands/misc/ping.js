export default {
  name: "ping",
  description: "Pong!",
  // devOnly: Boolean,
  // testOnly: Boolean,
  // options: Object[]

  callback: async (client, interaction) => {
    await interaction.reply(`Pong! ${client.ws.ping}ms`);
  },
};
