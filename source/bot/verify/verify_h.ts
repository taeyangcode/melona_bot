import { MessageActionRow, MessageEmbed } from "discord.js";

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