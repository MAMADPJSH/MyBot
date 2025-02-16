import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
dotenv.config();
const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const CLIENT_ID = process.env.APPLICATION_ID;

const commands = [
  {
    name: "hey",
    description: "Replies with hey",
  },
  {
    name: "ping",
    description: "Replies with pong",
  },
];

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("Registering commands...");

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });

    console.log("Registered commands");
  } catch (error) {
    console.log(error);
  }
})();
