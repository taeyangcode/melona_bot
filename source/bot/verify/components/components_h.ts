import { MessageEmbed, MessageActionRow } from "discord.js";

export const buttonId: Record<string, string> = {
    newMember: "NEW_MEMBER",
    returningMember: "RETURNING_MEMBER"
};

export interface MessageComponents {
    embed: MessageEmbed;
    row: MessageActionRow;
};