import { BanOptions, Client, Collection, DMChannel, Guild, GuildMember, Message, MessageActionRow, MessageEmbed, MessageOptions, Snowflake, TextBasedChannel, User } from "discord.js";
import { getDiscordAdminChannelID, getDiscordServerID } from "../../env/env-helper.js";

export const BUTTON_NEW_MEMBER_ID: Readonly<string> = "B_NEW_MEMBER";
export const BUTTON_RETURNING_MEMBER_ID: Readonly<string> = "B_RETURNING_MEMBER";
export const BUTTON_NEW_MEMBER_SELECTION_ID: Readonly<string> = "B_NEW_MEMBER_SELECTION";
export const BUTTON_RETURNING_MEMBER_SELECTION_ID: Readonly<string> = "B_RETURNING_MEMBER_SELECTION";

export const BUTTON_ACCEPT_MEMBER_ID: Readonly<string> = "B_ACCEPT_MEMBER";
export const BUTTON_REJECT_MEMBER_ID: Readonly<string> = "B_REJECT_MEMBER";

export interface MessageComponents {
    embed: MessageEmbed;
    row?: MessageActionRow;
};

export async function createDMChannel(member: GuildMember): Promise<DMChannel> {
    return await member.createDM();
}

export async function getMessagesAfterTimestamp(messageID: string, channel: DMChannel, limit: number): Promise<Message[]> {
    const messageCollection: Collection<string, Message> = await channel.messages.fetch({ limit, after: messageID });
    return Array.from(messageCollection.values());
}

export async function sendToAdminChannel(botClient: Client, options: MessageOptions): Promise<Message> {
    const adminChannel: TextBasedChannel | null = await botClient.channels.fetch(getDiscordAdminChannelID()) as TextBasedChannel | null;
    if (adminChannel === null) {
        throw Error("Admin Channel couldn't be located.");
    }
    return await adminChannel.send(options);
}

export function getMelonaServer(botClient: Client): Guild {
    const server: Guild | undefined = botClient.guilds.cache.get(getDiscordServerID());
    if (typeof server === "undefined") {
        throw Error("Melona Server could not be found.");
    }
    return server;
}

export async function kickMember(server: Guild, member: User, reason?: string): Promise<Snowflake | User | GuildMember> {
    return await server.members.kick(member, reason || "No reason supplied.");
}

export async function banMember(server: Guild, member: User, options: BanOptions): Promise<Snowflake | User | GuildMember> {
    return await server.members.ban(member, options);
}