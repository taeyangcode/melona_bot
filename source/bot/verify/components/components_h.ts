import { MessageEmbed, MessageActionRow, MessageActionRowComponent, MessageButton, Snowflake, DMChannel, Message, Collection } from "discord.js";

export const buttonId: Record<string, string> = {
    newMember: "NEW_MEMBER",
    returningMember: "RETURNING_MEMBER",

    newMemberApplicationDone: "NEW_MEMBER_APPLICATION_DONE",
    returningMemberApplicationDone: "RETURNING_MEMBER_APPLICATION_DONE",

    acceptMember: "ACCEPT_MEMBER",
    kickMember: "KICK_MEMBER",
    banMember: "BAN_MEMBER"
};

export type MemberType = "New" | "Returning";

export interface MessageComponents {
    embed: MessageEmbed;
    row: MessageActionRow;
};

export function doneButton(id: string): MessageButton {
    const button: MessageButton = new MessageButton();
    button.setEmoji("✅");
    button.setLabel("Done");
    button.setStyle("SUCCESS");
    button.setCustomId(id);

    return button;
}

export function acceptButton(id: string): MessageButton {
    const button: MessageButton = new MessageButton();
    button.setLabel("Accept");
    button.setStyle("SUCCESS");
    button.setCustomId(id);

    return button;
}

export function kickButton(id: string): MessageButton {
    const button: MessageButton = new MessageButton();
    button.setLabel("Kick");
    button.setStyle("DANGER");
    button.setCustomId(id);

    return button;
}

export function banButton(id: string): MessageButton {
    const button: MessageButton = new MessageButton();
    button.setLabel("Ban");
    button.setStyle("DANGER");
    button.setCustomId(id);
    
    return button;
}

export function createMessageActionRow<T extends MessageActionRowComponent>(...components: T[]): MessageActionRow<MessageActionRowComponent> {
    const actionRow: MessageActionRow = new MessageActionRow();
    actionRow.addComponents(components);
    return actionRow;
}

export async function getSubsequentMessages(dmChannel: DMChannel, messageId: Snowflake, messageAmount: number): Promise<Message[]> {
    const messages: Collection<string, Message> = await dmChannel.messages.fetch({ limit: messageAmount, after: messageId });
    return Array.from(messages.values());
}