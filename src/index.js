import * as npm from "./npm.js";
import { createTmpDir, removeTmpDir } from "./fs.js";

const renamePackageForVersion = (packageName, newName, options) => async (
  version
) => {
  const tmpDir = await createTmpDir();
  try {
    await npm.downloadPackage(tmpDir, packageName, version);
    await npm.renamePackage(tmpDir, newName);
    try {
      await npm.uploadPackage(tmpDir, options);
      console.log(`== ${newName}@${version} was uploaded`);
    } catch (e) {
      console.log(`-- The upload of ${newName}@${version} failed`);
      console.log(e);
      throw e;
    }
    await removeTmpDir(tmpDir);
  } catch (e) {
    await removeTmpDir(tmpDir);
  }
};

/**
 * @param {string} packageName
 * @param {string} newName
 * @returns {Promise<void>}
 */
export const renamePackage = async (packageName, newName, options = {}) => {
  if (!packageName) {
    throw new Error("A package name needs to be provided");
  }

  if (!newName) {
    throw new Error(`A new name for ${packageName} needs to be provided`);
  }

  let versions;
  if (options.versions && Array.isArray(options.versions)) {
    versions = options.versions;
  } else {
    versions = await npm.getAllVersions(packageName);
  }
  if (options.excluded && Array.isArray(options.excluded)) {
    versions = versions.filter((v) => !options.excluded.includes(v));
  }

  const applyRename = renamePackageForVersion(packageName, newName, options);
  for (const version of versions) {
    await applyRename(version);
  }
};
