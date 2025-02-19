import importJSON from "../../utils/importJSON.js";
const config = await importJSON("../../config.json");
import getApplicationCommands from "../../utils/getApplicationCommands.js";
import getLocalCommands from "../../utils/getLocalCommands.js";
import areCommandsDifferent from "../../utils/areCommandsDifferent.js";
export default async (client) => {
  try {
    const localCommands = await getLocalCommands();
    const applicationCommands = await getApplicationCommands(
      client,
      config.test_server
    );

    for (const localCommand of localCommands) {
      const { name, description, options = [] } = localCommand;

      if (!name || !description) {
        console.log("Command " + name + " has no name or description");
        continue;
      }

      const existingCommand = await applicationCommands.cache.find(
        (command) => command.name === name
      );

      if (existingCommand) {
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id);
          console.log("deleted: " + name);
          continue;
        }

        if (areCommandsDifferent(existingCommand, localCommand)) {
          const updateData = {
            name,
            description,
            options: options || [],
          };

          await applicationCommands.edit(existingCommand.id, updateData);
          console.log("Updated: " + name);
        }
      } else {
        if (localCommand.deleted) {
          continue;
        }

        const createData = {
          name,
          description,
          options: options || [],
        };

        await applicationCommands.create(createData);
        console.log("Created: " + name);
      }
    }
  } catch (error) {
    console.log(
      error + " at this command: name: " + name + " description: " + description
    );
  }
};
