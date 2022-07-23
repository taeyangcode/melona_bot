import { MessageEmbed, MessageActionRow, MessageActionRowComponent, MessageButton, Message } from "discord.js";

export const buttonId: Record<string, string> = {
    newMember: "NEW_MEMBER",
    returningMember: "RETURNING_MEMBER",

    newMemberApplicationDone: "NEW_MEMBER_APPLICATION_DONE",
    returningMemberApplicationDone: "RETURNING_MEMBER_APPLICATION_DONE"
};

export interface MessageComponents {
    embed: MessageEmbed;
    row: MessageActionRow;
};

export function createMessageActionRow<T extends MessageActionRowComponent>(...components: T[]): MessageActionRow<MessageActionRowComponent> {
    const actionRow: MessageActionRow = new MessageActionRow();
    actionRow.addComponents(components);
    return actionRow;
} 

export function doneButton(id: string): MessageButton {
    const button: MessageButton = new MessageButton();
    button.setEmoji("✅");
    button.setLabel("Done");
    button.setStyle("SUCCESS");
    button.setCustomId(id);

    return button;
}