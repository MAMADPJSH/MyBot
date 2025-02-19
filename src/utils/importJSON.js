import { createRequire } from "module";

export default async (path) => {
  try {
    const require = createRequire(import.meta.url);
    const data = require(path);
    return data;
  } catch (error) {
    console.log(error);
  }
};
