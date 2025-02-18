export default {
  name: "ping",
  description: "Pong!",
  // devOnly: Boolean,
  // testOnly: Boolean,
  // options: Object[]

  callback: (client, interaction) => {
    interaction.reply("Pong");
  },
};
