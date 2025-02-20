import importJSON from "../../utils/importJSON.js";
const config = await importJSON("../../config.json");
import getLocalCommands from "../../utils/getLocalCommands.js";
import { MessageFlags } from "discord.js";

export default async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const localCommands = await getLocalCommands();

  try {
    const commandObject = localCommands.find((command) => {
      return command.name === interaction.commandName;
    });

    if (!commandObject) return console.log("Command not found");

    //check if the command is only available to the developers
    if (commandObject.devOnly && !devs.includes(interaction.user.id)) {
      interaction.reply({
        content: "This command is only available to the developers.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    //check if the command is only available in the test server
    if (commandObject.testOnly && !(interaction.guildId === testServer)) {
      interaction.reply({
        content: "This command cannot be ran here",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    //check if the user has the permissions to run the command
    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          interaction.reply({
            content: "You dont have the permission to run this command",
            flags: MessageFlags.Ephemeral,
          });
          break;
        }
      }
    }

    //check if the bot has the permissions to run the command
    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
        const bot = interaction.guild.members.me;
        if (!bot.permissions.has(permission)) {
          interaction.reply({
            content: "The bot doesnt have the permission to run this command",
            flags: MessageFlags.Ephemeral,
          });
          break;
        }
      }
    }

    await commandObject.callback(client, interaction);
  } catch (error) {
    console.log(error);
  }
};
