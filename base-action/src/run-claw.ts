import { runClawWithSdk } from "./run-claw-sdk";
import type { ClawRunResult } from "./run-claw-sdk";
import { parseSdkOptions } from "./parse-sdk-options";

export type ClawOptions = {
  clawArgs?: string;
  model?: string;
  pathToClawCodeExecutable?: string;
  allowedTools?: string;
  disallowedTools?: string;
  maxTurns?: string;
  mcpConfig?: string;
  systemPrompt?: string;
  appendSystemPrompt?: string;
  fallbackModel?: string;
  showFullOutput?: string;
};

export async function runClaw(
  promptPath: string,
  options: ClawOptions,
): Promise<ClawRunResult> {
  const parsedOptions = parseSdkOptions(options);
  return runClawWithSdk(promptPath, parsedOptions);
}
