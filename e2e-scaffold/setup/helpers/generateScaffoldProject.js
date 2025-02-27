const execa = require("execa");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const { mockConfig } = require("./mockConfig");

dotenv.config();

const { 
  E2E_SCAFFOLD_WORKSPACE_ID, 
  E2E_SCAFFOLD_EMAIL, 
  E2E_SCAFFOLD_PASSWORD, 
} = process.env;

const generateScaffoldProject = async () => {
  try {
    const configPath = path.join(process.env.HOME, ".8baserc");
    const configBackupPath = path.join(process.env.HOME, ".8baserc_backup");

    if (fs.existsSync(configPath)) {
      fs.copyFileSync(configPath, configBackupPath);
    }

    fs.writeFileSync(configPath, mockConfig);

    const { stdout: loginStdout } = await execa("node", ["./dist", "login", `--email=${E2E_SCAFFOLD_EMAIL}`, `--password=${E2E_SCAFFOLD_PASSWORD}`, `--workspace=${E2E_SCAFFOLD_WORKSPACE_ID}`]);
    console.log(loginStdout);

    await execa("rm", ["-rf", "temp"]);
    await execa("mkdir", ["temp"]);

    const { stdout: createStdout } = await execa("node", ["../dist", "generate", "app", "app-example"], { cwd: "temp" });
    console.log(createStdout);

    const { stdout: brokersStdout } = await execa("node", ["../../dist", "generate", "scaffold", "brokers", "--all"], { cwd: "temp/app-example" });
    console.log(brokersStdout);

    const { stdout: customersStdout } = await execa("node", ["../../dist", "generate", "scaffold", "customers", "--all"], { cwd: "temp/app-example" });
    console.log(customersStdout);

    const { stdout: listingStdout } = await execa("node", ["../../dist", "generate", "scaffold", "listings", "--all"], { cwd: "temp/app-example" });
    console.log(listingStdout);

    const { stdout: propertiesStdout } = await execa("node", ["../../dist", "generate", "scaffold", "properties", "--all"], { cwd: "temp/app-example" });
    console.log(propertiesStdout);

    fs.unlinkSync(path.join(process.env.HOME, ".8baserc"));

    if (fs.existsSync(configBackupPath)) {
      fs.copyFileSync(configBackupPath, configPath);
      fs.unlinkSync(configBackupPath);
    }

    const { stdout: npmInstallStdout } = await execa("npm", ["install"], { cwd: "temp/app-example" });
    console.log(npmInstallStdout);

  } catch (err) {
    console.log(err);
  }
};

module.exports.generateScaffoldProject = generateScaffoldProject;
