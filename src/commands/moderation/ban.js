import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";

export default {
  name: "ban",
  description: "Bans a user",
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
      name: "user",
      description: "The user to ban",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: "reason",
      description: "The reason for the ban",
      required: false,
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.Administrator],

  callback: (client, interaction) => {
    interaction.reply("ban");
  },
};
