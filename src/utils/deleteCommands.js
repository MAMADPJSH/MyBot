//run this code to delete all commands from the test server

import { REST, Routes } from "discord.js";
import importJSON from "../utils/importJSON.js";
const data = await importJSON("../../config.json");
import dotenv from "dotenv";

dotenv.config();

const rest = new REST().setToken(process.env.TOKEN);

// for guild-based commands
await rest
  .put(Routes.applicationGuildCommands(data.client_id, data.test_server), {
    body: [],
  })
  .then(() => console.log("Successfully deleted all guild commands."))
  .catch(console.error);

// for global commands
await rest
  .put(Routes.applicationCommands(data.client_id), { body: [] })
  .then(() => console.log("Successfully deleted all application commands."))
  .catch(console.error);
