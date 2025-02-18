import fs from "fs";
import path from "path";

export const getAllFiles = (dir, foldersOnly = false) => {
  let fileNames = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dir, file.name);

    if (foldersOnly) {
      fileNames.push(filePath);
    } else {
      if (file.isFile()) {
        fileNames.push(filePath);
      }
    }
  }

  return fileNames;
};
