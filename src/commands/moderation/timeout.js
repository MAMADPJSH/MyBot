import {
  Client,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  MessageFlags,
} from "discord.js";
import ms from "ms"; //converts string to milliseconds
import prettyMs from "pretty-ms";

export default {
  name: "timeout",
  description: "times out a user",
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
      name: "target",
      description: "The user to timeout",
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
    },
    {
      name: "duration",
      description: "how long to be timed out for (10 min, 1 hr, 1 day)",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "reason",
      description: "The reason for the timeout",
      required: false,
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [PermissionFlagsBits.ModerateMembers],

  /** This is necessaryyy to get intelisense to work
   *
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get("target").value;
    const reason =
      interaction.options.get("reason")?.value || "No reason provided";
    const duration = interaction.options.get("duration").value;
    const durationInMs = ms(duration);

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (isNaN(durationInMs)) {
      await interaction.editReply({
        content: "Invalid duration",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    // checks if duration is between 5 seconds and 29 days
    if (durationInMs < 5000 || durationInMs > 2505600000) {
      await interaction.editReply({
        content: "Duration must be between 5 seconds and 29 days",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    // checks if user is still in server
    if (!targetUser) {
      await interaction.editReply({
        content: "Could not find that user",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    // checks if the user is a bot
    if (targetUser.user.bot) {
      await interaction.editReply({
        content: "I cannot timeout a bot",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    // checks if user is the owner of the server
    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply({
        content: "You cannot timeout the owner of the server",
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
        content: "You cannot timeout a user with a higher or equal role to you",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    // checks if bot has a higher role than target
    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply({
        content: "I cannot timeout a user with a higher or equal role to me",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    // time out the user
    try {
      // if the user is already timed out, update the timeout
      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(durationInMs, reason);
        await interaction.editReply({
          content: `Updated timeout for ${targetUser} to ${prettyMs(
            durationInMs,
            { verbose: true }
          )} \nReason: ${reason}`,
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      await targetUser.timeout(durationInMs, reason);
      await interaction.editReply({
        content: `Successfully timed out ${targetUser} for ${prettyMs(
          durationInMs,
          { verbose: true }
        )} \nReason: ${reason}`,
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
