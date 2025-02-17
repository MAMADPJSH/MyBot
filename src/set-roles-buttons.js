import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  GatewayIntentBits,
} from "discord.js";
import dotenv from "dotenv";
dotenv.config();
const TOKEN = process.env.TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.login(TOKEN);

const roles = [
  {
    id: "1340726040296951889",
    label: "red",
  },
  {
    id: "1340725999821652028",
    label: "blue",
  },
  {
    id: "1340726082290192444",
    label: "green",
  },
];

client.on("ready", async (c) => {
  try {
    const channel = await client.channels.cache.get("1339577648065806369");
    if (!channel) return;

    const row = new ActionRowBuilder();
    roles.forEach((role) => {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(role.id)
          .setLabel(role.label)
          .setStyle(ButtonStyle.Primary)
      );
    });

    await channel.send({
      content: "Choose a role:",
      components: [row],
    });
  } catch (error) {
    console.log(error);
  }
});
