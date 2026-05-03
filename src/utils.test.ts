import fs from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { withTempDir } from "./test-helpers/temp-dir.js";
import {
  ensureDir,
  resolveConfigDir,
  resolveHomeDir,
  resolveUserPath,
  shortenHomeInString,
  shortenHomePath,
  sleep,
} from "./utils.js";

describe("ensureDir", () => {
  it("creates nested directory", async () => {
    await withTempDir({ prefix: "openclaw-test-" }, async (tmp) => {
      const target = path.join(tmp, "nested", "dir");
      await ensureDir(target);
      expect(fs.existsSync(target)).toBe(true);
    });
  });
});

describe("sleep", () => {
  it("resolves after delay using fake timers", async () => {
    vi.useFakeTimers();
    try {
      const promise = sleep(1000);
      vi.advanceTimersByTime(1000);
      await expect(promise).resolves.toBeUndefined();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("resolveConfigDir", () => {
  it("prefers ~/.quantclaw when legacy dir is missing", async () => {
    await withTempDir({ prefix: "openclaw-config-dir-" }, async (root) => {
      const newDir = path.join(root, ".quantclaw");
      await fs.promises.mkdir(newDir, { recursive: true });
      const resolved = resolveConfigDir({} as NodeJS.ProcessEnv, () => root);
      expect(resolved).toBe(newDir);
    });
  });

  it("expands QUANTCLAW_STATE_DIR using the provided env", () => {
    const env = {
      HOME: "/tmp/quantclaw-home",
      QUANTCLAW_STATE_DIR: "~/state",
    } as NodeJS.ProcessEnv;

    expect(resolveConfigDir(env)).toBe(path.resolve("/tmp/quantclaw-home", "state"));
  });

  it("falls back to the config file directory when only QUANTCLAW_CONFIG_PATH is set", () => {
    const env = {
      HOME: "/tmp/quantclaw-home",
      QUANTCLAW_CONFIG_PATH: "~/profiles/dev/quantclaw.json",
    } as NodeJS.ProcessEnv;

    expect(resolveConfigDir(env)).toBe(path.resolve("/tmp/quantclaw-home", "profiles", "dev"));
  });
});

describe("resolveHomeDir", () => {
  it("prefers QUANTCLAW_HOME over HOME", () => {
    vi.stubEnv("QUANTCLAW_HOME", "/srv/quantclaw-home");
    vi.stubEnv("HOME", "/home/other");
    try {
      expect(resolveHomeDir()).toBe(path.resolve("/srv/quantclaw-home"));
    } finally {
      vi.unstubAllEnvs();
    }
  });
});

describe("shortenHomePath", () => {
  it("uses $QUANTCLAW_HOME prefix when QUANTCLAW_HOME is set", () => {
    vi.stubEnv("QUANTCLAW_HOME", "/srv/quantclaw-home");
    vi.stubEnv("HOME", "/home/other");
    try {
      expect(
        shortenHomePath(`${path.resolve("/srv/quantclaw-home")}/.quantclaw/quantclaw.json`),
      ).toBe("$QUANTCLAW_HOME/.quantclaw/quantclaw.json");
    } finally {
      vi.unstubAllEnvs();
    }
  });
});

describe("shortenHomeInString", () => {
  it("uses $QUANTCLAW_HOME replacement when QUANTCLAW_HOME is set", () => {
    vi.stubEnv("QUANTCLAW_HOME", "/srv/quantclaw-home");
    vi.stubEnv("HOME", "/home/other");
    try {
      expect(
        shortenHomeInString(
          `config: ${path.resolve("/srv/quantclaw-home")}/.quantclaw/quantclaw.json`,
        ),
      ).toBe("config: $QUANTCLAW_HOME/.quantclaw/quantclaw.json");
    } finally {
      vi.unstubAllEnvs();
    }
  });
});

describe("resolveUserPath", () => {
  it("expands ~ to home dir", () => {
    expect(resolveUserPath("~", {}, () => "/Users/thoffman")).toBe(path.resolve("/Users/thoffman"));
  });

  it("expands ~/ to home dir", () => {
    expect(resolveUserPath("~/openclaw", {}, () => "/Users/thoffman")).toBe(
      path.resolve("/Users/thoffman", "openclaw"),
    );
  });

  it("resolves relative paths", () => {
    expect(resolveUserPath("tmp/dir")).toBe(path.resolve("tmp/dir"));
  });

  it("prefers QUANTCLAW_HOME for tilde expansion", () => {
    vi.stubEnv("QUANTCLAW_HOME", "/srv/quantclaw-home");
    vi.stubEnv("HOME", "/home/other");
    try {
      expect(resolveUserPath("~/quantclaw")).toBe(path.resolve("/srv/quantclaw-home", "quantclaw"));
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it("uses the provided env for tilde expansion", () => {
    const env = {
      HOME: "/tmp/quantclaw-home",
      QUANTCLAW_HOME: "/srv/quantclaw-home",
    } as NodeJS.ProcessEnv;

    expect(resolveUserPath("~/quantclaw", env)).toBe(
      path.resolve("/srv/quantclaw-home", "quantclaw"),
    );
  });

  it("keeps blank paths blank", () => {
    expect(resolveUserPath("")).toBe("");
    expect(resolveUserPath("   ")).toBe("");
  });

  it("returns empty string for undefined/null input", () => {
    expect(resolveUserPath(undefined as unknown as string)).toBe("");
    expect(resolveUserPath(null as unknown as string)).toBe("");
  });
});
