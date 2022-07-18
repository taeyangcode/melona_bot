import { config } from "dotenv";

function getEnvPath(fileName: string): string {
    return `${process.cwd()}/environment/${fileName}`;
}

export function instantiateEnvConfig(envFileName: string): void {
    config({ path: getEnvPath(envFileName) });
}

function getEnvValue(variableName: string): string | undefined {
    return process.env[variableName];
}

export function getDiscordBotToken(): string {
    const token: string | undefined = getEnvValue("DISCORD_BOT_TOKEN");
    if (typeof token === "undefined") {
        throw Error("Discord Bot token undefined.");
    }
    return token;
}

export function getDiscordServerID(): string {
    const token: string | undefined = getEnvValue("DISCORD_SERVER_ID");
    if (typeof token === "undefined") {
        throw Error("Discord Bot token undefined.");
    }
    return token;
}

export function getDiscordAdminChannelID(): string {
    const token: string | undefined = getEnvValue("DISCORD_ADMIN_CHANNEL_ID");
    if (typeof token === "undefined") {
        throw Error("Discord Admin Channel ID undefined.");
    }
    return token;
}