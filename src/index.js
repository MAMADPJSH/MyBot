import { Client, GatewayIntentBits } from "discord.js";
import { REST } from "@discordjs/rest";
import dotenv from "dotenv";
let TOKEN = process.env.TOKEN;

dotenv.config();

const rest = new REST({ version: "10" }).setToken(TOKEN);

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

client.on("messageCreate", (message) => {
  console.log(message.content);
  console.log(message.createdAt.toDateString());
  console.log(message.author.username);
});

client.on("channelCreate", (channel) => {
  console.log(channel.name);
  console.log(channel.create);
  console.log(channel.createdAt.toDateString());
  console.log(channel.guild.name);
});
