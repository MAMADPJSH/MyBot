import path from "path";
import { pathToFileURL } from "url";
import { getAllFiles } from "./getAllFiles.js";
import { __dirname } from "./__dirname.js";

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

      if (exceptions.includes(commandObject.name)) continue;

      localCommands.push(commandObject);
    }
  }

  return localCommands;
};
