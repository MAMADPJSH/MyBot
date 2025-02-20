import {
  Client,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  MessageFlags,
} from "discord.js";

export default {
  name: "kick",
  description: "kicks a user",
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
      name: "target",
      description: "The user to kick",
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
    },
    {
      name: "reason",
      description: "The reason for the kick",
      required: false,
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.KickMembers],
  botPermissions: [PermissionFlagsBits.KickMembers],

  /** This is necessaryyy to get intelisense to work
   *
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get("target").value;
    const reason =
      interaction.options.get("reason")?.value || "No reason provided";

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    // checks if user is still in server
    if (!targetUser) {
      await interaction.editReply({
        content: "Could not find that user",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    // checks if user is the owner of the server
    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply({
        content: "You cannot kick the owner of the server",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; //highest role position of target
    const requestUserRolePosition = interaction.member.roles.highest.position; //highest role position of person running command
    const botRolePosition = interaction.guild.members.me.roles.highest.position; //highest role position of bot

    // checks if target has a higher or equal role to the person running the command
    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply({
        content: "You cannot kick a user with a higher or equal role to you",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    // checks if bot has a higher role than target
    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply({
        content: "I cannot kick a user with a higher or equal role to me",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    //Kicking the user
    try {
      await targetUser.kick({ reason });
      await interaction.editReply({
        content: `Successfully kicked ${targetUser}\nReason: ${reason}`,
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
