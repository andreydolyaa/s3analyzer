import chalk from "chalk";

const levels = {
  INFO: { label: "INFO", color: chalk.cyan },
  OK: { label: "OK", color: chalk.green },
  WARN: { label: "WARN", color: chalk.yellow },
  CRITICAL: { label: "CRITICAL", color: chalk.red },
  ERROR: { label: "ERROR", color: chalk.bgRed.white },
  DEBUG: { label: "DEBUG", color: chalk.gray },
};

function getTimestamp() {
  return chalk.dim(new Date().toISOString());
}

function log(level, message, context = null) {
  const { label, color } = levels[level];
  const timestamp = getTimestamp();
  const prefix = color(`[${label}]`);
  const ctx = context ? chalk.magenta(`[${context}]`) : "";
  console.log(`${timestamp} ${prefix} ${ctx} ${message}`);
}

export const logger = {
  info: (msg, ctx) => log("INFO", msg, ctx),
  ok: (msg, ctx) => log("OK", msg, ctx),
  warn: (msg, ctx) => log("WARN", msg, ctx),
  critical: (msg, ctx) => log("CRITICAL", msg, ctx),
  error: (msg, ctx) => log("ERROR", msg, ctx),
  debug: (msg, ctx) => log("DEBUG", msg, ctx),
};

export function createScanLogger(module, resourceName) {
  return {
    start: () => {
      console.log(
        `\n${chalk.bold.blue(">")} ${chalk.bold.white(`[${module}]`)} ${chalk.bold.yellow(resourceName)}`,
      );
    },
    finding: (status, check, detail) => {
      const statusLabel =
        status === "OK"
          ? chalk.green(`[${status}]`)
          : status === "CRITICAL"
            ? chalk.red(`[${status}]`)
            : status === "HIGH"
              ? chalk.red(`[${status}]`)
              : chalk.yellow(`[${status}]`);
      console.log(`  ${statusLabel} ${chalk.bold(check)}: ${detail}`);
    },
    summary: (passed, failed) => {
      console.log(
        `  ${chalk.bold("Summary:")} ${chalk.green(`${passed} passed`)} | ${chalk.red(`${failed} failed`)}`,
      );
    },
  };
}
