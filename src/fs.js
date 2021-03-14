import { tmpdir } from "os";
import { mkdtemp, rm } from "fs/promises";
import * as path from "path";

const key = "project-reuploader-";

/**
 * @returns {Promise<string>}
 */
export const createTmpDir = async () => {
  const tmpDir = await mkdtemp(path.join(tmpdir(), key));
  console.log("Created " + tmpDir);
  return tmpDir;
};

/**
 *
 * @param {string} folderToRemove
 */
export const removeTmpDir = async (folderToRemove) => {
  if (!folderToRemove.startsWith(tmpdir())) {
    throw "Needs to be a temporary folder";
  }
  await rm(folderToRemove, { recursive: true, force: true });
  console.log("Removed " + folderToRemove);
};
