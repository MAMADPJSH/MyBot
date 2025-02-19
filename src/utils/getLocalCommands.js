import path from "path";
import { pathToFileURL } from "url";
import { getAllFiles } from "./getAllFiles.js";
import { __dirname } from "./__dirname.js";
import commandExtractor from "./commandExtractor.js";

export default async (exceptions = []) => {
  let localCommands = [];

  const commandCategories = getAllFiles(
    path.join(__dirname, "..", "commands"),
    true
  );

  for (const commandCategory of commandCategories) {
    const commandFiles = getAllFiles(commandCategory);

    for (const commandFile of commandFiles) {
      const commandObject = await import(pathToFileURL(commandFile));

      try {
        const command = await commandExtractor(commandFile);

        if (!command) {
          console.log("This command has no default export: " + commandFile);
          continue;
        }

        if (exceptions.includes(command.name)) continue;

        localCommands.push(command);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return localCommands;
};
