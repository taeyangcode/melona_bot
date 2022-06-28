import { instantiateEnvConfig, getDiscordBotToken } from "./env/env-helper.js";
import { MelonaBot } from "./bot/setup.js";

async function start(): Promise<void> {
    instantiateEnvConfig(".env.discord");
    const bot: MelonaBot = new MelonaBot(getDiscordBotToken());
}
start();