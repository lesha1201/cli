import { ExecutionConfig, StaticConfig, setTraceLevel, TraceLevel, debug } from "../../common";
import { CommandManager, BaseCommand } from "../../engine";
import { InvalidArgument } from "../../errors/invalidArgument";
import { getFileProvider } from "../../engine";

import * as path from "path";
import * as _ from "lodash";


jest.mock("../../engine/commands/init/installer");

describe("install 8base template repository", () => {

  test("check correct parse command line", async () => {
    try {
      CommandManager.initialize(new ExecutionConfig([]));
    } catch (er) {
      expect(er).toBeInstanceOf(InvalidArgument);
    }

    try {
      CommandManager.initialize(new ExecutionConfig(["init"]));
    } catch (er) {
      expect(er).toBeInstanceOf(InvalidArgument);
    }
  });

  test("check correct instance init command", async () => {
      const cmd = CommandManager.initialize(new ExecutionConfig(["init", "-r", "testrepname"]));
      expect(cmd).toBeInstanceOf(BaseCommand);
  });

  test("check receive template repository", async () => {
    const files = await getFileProvider().provide();
    expect(files.size).toBeGreaterThan(0);
  });

  test("check install template repository", async () => {
    const fs = require("memfs");
    const repName = "ololorepa";
    const cmd = CommandManager.initialize(new ExecutionConfig(["init", "-r", repName], { fs: true }));
    const resPath = await CommandManager.run(cmd);

    expect(resPath).toBe(path.join("/", repName));

    const files = await getFileProvider().provide();

    files.forEach((value:string, name:string) => {
      expect(fs.existsSync(path.join(resPath, name))).toBe(true);
    });
  });
});
