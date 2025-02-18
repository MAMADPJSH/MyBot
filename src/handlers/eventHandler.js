import { getAllFiles } from "../utils/getAllFiles.js";
import path from "path";
import { pathToFileURL } from "url";
import { __dirname } from "../utils/__dirname.js";

export default (client) => {
  const eventFolders = getAllFiles(path.join(__dirname, "..", "events"), true);

  for (const eventFolder of eventFolders) {
    const eventsFiles = getAllFiles(eventFolder);
    eventsFiles.sort((a, b) => a > b); // sort files by number before their name

    const eventName = eventFolder.replace(/\\/g, "/").split("/").pop();

    client.on(eventName, async (arg) => {
      for (const eventFile of eventsFiles) {
        const eventModule = await import(pathToFileURL(eventFile));
        const eventFunction = eventModule.default;
        await eventFunction(client, arg);
      }
    });
  }
};
