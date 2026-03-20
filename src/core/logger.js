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

export class Logger {
  constructor(module) {
    this.module = module;
  }
  log(resource, messages = []) {
    console.log(
      `${chalk.bold.blue(">")} ${chalk.bold.white(`[${this.module}]`)} ${chalk.bold.yellow(resource)}`,
    );
    messages.forEach((message) => console.log(`\t- ${message}`));
    console.log("\n");
  }
}
