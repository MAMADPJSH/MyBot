import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import dotenv from "dotenv";
dotenv.config();
let TOKEN = process.env.TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.login(TOKEN);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// client.on("messageCreate", (message) => {
//   console.log(message.content);
//   console.log(message.createdAt.toDateString());
//   console.log(message.author.username);
// });

// client.on("channelCreate", (channel) => {
//   console.log(channel.name);
//   console.log(channel.create);
//   console.log(channel.createdAt.toDateString());
//   console.log(channel.guild.name);
// });

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "hey") {
    interaction.reply("Hey!");
  }

  if (interaction.commandName === "ping") {
    interaction.reply("Pong!");
  }

  if (interaction.commandName === "add") {
    const num1 = interaction.options.getNumber("num1");
    const num2 = interaction.options.getNumber("num2");
    const sum = num1 + num2;
    interaction.reply(`The sum of ${num1} and ${num2} is ${sum}`);
  }

  if (interaction.commandName === "embed") {
    const embed = new EmbedBuilder();
    embed.setTitle(interaction.options.getString("title") || "My Embed");
    embed.setDescription(
      interaction.options.getString("description") || "This is an embed"
    );
    embed.setColor("Random");
    embed.addFields(
      { name: "Field 1", value: "Value 1", inline: true },
      { name: "Field 2", value: "Value 2", inline: true }
    );
    embed.setThumbnail(interaction.user.displayAvatarURL());
    embed.setTimestamp();
    interaction.reply({ embeds: [embed] });
  }

  if (interaction.isButton()) {
    try {
      const role = interaction.guild.roles.cache.get(interaction.customId);
      if (!role) {
        return interaction.reply({
          content: "Role not found",
          ephemeral: true,
        });
      }

      if (interaction.member.roles.cache.has(role.id)) {
        await interaction.member.roles.remove(role);
        await interaction.reply({
          content: `Removed ${role.name} role`,
          ephemeral: true,
        });
      } else {
        await interaction.member.roles.add(role);
        await interaction.reply({
          content: `Added ${role.name} role`,
          ephemeral: true,
        });
      }
    } catch (error) {
      console.log(error);
      await interaction.reply({
        content: "Something went wrong",
        ephemeral: true,
      });
    }
  }
});
