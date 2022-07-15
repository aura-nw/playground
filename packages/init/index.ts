import * as fs from "fs-extra";
import { dockerInit } from "./lib/docker"
import path from "path";
import { faucet } from "./lib/faucet";

/**
 * init
 */
export class InitConfig {
  async init() {
    await dockerInit();

    //Init connection json file
    let currentDir = process.cwd();
    let configPath = path.join(currentDir, "env.json");

    if (fs.existsSync(configPath)) {
      //env json file exists
      await writeEnv(configPath);
    } else {
      //file do not exist then create env json file
      await createEnvFile(configPath);
      await writeEnv(configPath);
    }

    await faucet(configPath);
  }
}

async function createEnvFile(localPath: string) {
  let file = path.join(localPath);
  try {
    await fs.ensureFile(file);
    console.log("File connection env created!");
  } catch (err) {
    console.error(err);
  }
}

async function writeEnv(localPath: string) {
  try {
    let file = path.join(localPath);
    await fs.copyFile('/example/.env.example', file)
  } catch (error) {
    console.log(error);
  }
}

