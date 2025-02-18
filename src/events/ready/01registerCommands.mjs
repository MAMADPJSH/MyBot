import config from "../../../config.json" with { type: "json" }; //with is required for import json files
import getApplicationCommands from "../../utils/getApplicationCommands.js";
import getLocalCommands from "../../utils/getLocalCommands.js";

export default async (client) => {
  try {
      const localCommands = getLocalCommands();
      const applicationCommands = getApplicationCommands(client, config["test-server"]);

      for (const localCommand of localCommands) {
        const { name, description, options } = localCommand;

        const existingCommand = await applicationCommands.cache.find((cmd) => cmd.name === name);

        if (existingCommand) {
          if (localCommand.deleted) {
            await applicationCommands.delete(existingCommand.id);
            console.log("deleted: " + name);
            continue;
          }
        }
      }
  } catch (error) {
    console.log(error);
  }
};
