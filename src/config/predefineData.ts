import * as path from "path";

export class PredefineData {
  projectDir = path.join(__dirname, "../");
  executionDir = process.cwd();
  templatePath = path.join(this.projectDir, "../template");
  commandsPath = path.join(this.projectDir, "./engine/commands");
  remoteAddress = "https://api.8base.com";
  authDomain = "auth.8base.com";
  authClientId = "qGHZVu5CxY5klivm28OPLjopvsYp0baD";
  webClientAddress = "https://app.8base.com";
}
