import {
  Client,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} from "discord.js";

export default {
  name: "ban",
  description: "Bans a user",
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
      name: "target",
      description: "The user to ban",
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
    },
    {
      name: "reason",
      description: "The reason for the ban",
      required: false,
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],

  /** This is necessaryyy to get intelisense to work
   *
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get("target").value;
    const reason =
      interaction.options.get("reason")?.value || "No reason provided";

    await interaction.deferReply({ ephemeral: true });

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    // checks if user is still in server
    if (!targetUser) {
      await interaction.editReply({
        content: "Could not find that user",
        ephemeral: true,
      });
      return;
    }

    // checks if user is the owner of the server
    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply({
        content: "You cannot ban the owner of the server",
        ephemeral: true,
      });
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; //highest role position of target
    const requestUserRolePosition = interaction.member.roles.highest.position; //highest role position of person running command
    const botRolePosition = interaction.guild.members.me.roles.highest.position; //highest role position of bot

    // checks if target has a higher or equal role to the person running the command
    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply({
        content: "You cannot ban a user with a higher or equal role to you",
        ephemeral: true,
      });
      return;
    }

    // checks if bot has a higher role than target
    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply({
        content: "I cannot ban a user with a higher or equal role to me",
        ephemeral: true,
      });
      return;
    }

    //Banning the user
    try {
      await targetUser.ban({ reason });
      await interaction.editReply({
        content: `Successfully banned ${targetUser}\nReason: ${reason}`,
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
