import { pathToFileURL } from "url";
//extracts the command from the command file (necessary for ES modules)
export default async (commandFile) => {
  const commandURL = pathToFileURL(commandFile).toString();
  const commandModule = await import(commandURL);
  const command = commandModule.default;

  if (!command) {
    console.log("This command has no default export: " + commandFile);
    return;
  }

  return command;
};
