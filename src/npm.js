import { exec as deprecatedExec } from "child_process";
import { promisify } from "util";
import { readFile, writeFile } from "fs/promises";
import * as path from "path";

const exec = promisify(deprecatedExec);

/**
 *
 * @param {string} packageName
 * @returns Promise<string[]>
 */
export const getAllVersions = (packageName) =>
  exec(`npm view ${packageName} versions  --json`).then(
    ({ stdout, stderr }) => {
      if (stderr) {
        throw stderr;
      }
      return JSON.parse(stdout);
    }
  );

const folder = "pkg";

/**
 * @param {string} workingDirectory
 * @param {string} packageName
 * @param {string} version
 */
export const downloadPackage = async (
  workingDirectory,
  packageName,
  version
) => {
  await exec(
    `cd ${workingDirectory} && mkdir tmp && cd tmp && npm init -y && npm i ${packageName}@${version} && mv node_modules/${packageName} ../${folder}/`
  );
  console.log(`${packageName}@${version} downloaded`);
};

export const renamePackage = async (workingDirectory, newName) => {
  const packageJsonPath = path.join(workingDirectory, folder, "package.json");
  const packageJson = JSON.parse((await readFile(packageJsonPath)).toString());
  packageJson.name = newName;
  if (packageJson.scripts && packageJson.scripts.prepublishOnly) {
    packageJson.scripts.prepublishOnly = "";
  }
  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
};

export const uploadPackage = async (workingDirectory, options = {}) => {
  let optionsString = "";
  if (options.otp) {
    optionsString += ` --otp=${options.otp}`;
  }
  if (options.access) {
    optionsString += ` --access ${options.access}`;
  }
  await exec(
    `cd ${workingDirectory} && cd ${folder} && npm publish ${optionsString}`
  );
};
