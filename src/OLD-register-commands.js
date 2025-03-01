/* 
import { REST, Routes, ApplicationCommandOptionType } from "discord.js";
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
  {
    name: "add",
    description: "Adds two numbers",
    options: [
      {
        name: "num1",
        description: "first number",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
      {
        name: "num2",
        description: "second number",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
    ],
  },
  {
    name: "embed",
    description: "Sends an embed",
    options: [
      {
        name: "title",
        description: "The title of the embed",
        type: ApplicationCommandOptionType.String,
      },
      {
        name: "description",
        description: "The description of the embed",
        type: ApplicationCommandOptionType.String,
      },
    ],
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
*/
