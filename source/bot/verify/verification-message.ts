import { User, Message, MessageEmbed, MessageButton, MessageActionRow, MessageActionRowComponent } from "discord.js";
import { BUTTON_ACCEPT_MEMBER_ID, BUTTON_REJECT_MEMBER_ID, MessageComponents } from "./verify_h.js";

export class VerificationMessage {
    private static returningMemberEmbed(user: User, messages: Message[]): MessageEmbed {
        const embed: MessageEmbed = new MessageEmbed();
        embed.setTitle("Returning Member Verification");

        let description: string = `**Username:** ${user}\n`;
        if (messages.length === 0) {
            description += `\n*User did not supply any further details*`;
        }
        else {
            messages.reverse();
            messages.forEach((message: Message, index: number): void => { 
                description += `\n**Message ${index + 1}:** ${message.content}`;
            });
        }
        embed.setDescription(description);

        return embed;
    }

    private static acceptButton(): MessageButton {
        const button: MessageButton = new MessageButton();
        button.setLabel("Accept");
        button.setStyle("SUCCESS");
        button.setCustomId(BUTTON_ACCEPT_MEMBER_ID);

        return button;
    }

    private static rejectButton(): MessageButton {
        const button: MessageButton = new MessageButton();
        button.setLabel("Reject");
        button.setStyle("DANGER");
        button.setCustomId(BUTTON_REJECT_MEMBER_ID);

        return button;
    }

    private static buttonRow(): MessageActionRow<MessageActionRowComponent> {
        const row: MessageActionRow = new MessageActionRow();
        row.addComponents(this.acceptButton(), this.rejectButton());

        return row;
    } 

    // public static newMemberComponents(): MessageComponents {

    // }

    public static returningMemberComponents(user: User, messages: Message[]): MessageComponents {
        return {
            embed: this.returningMemberEmbed(user, messages),
            row: this.buttonRow()
        };
    }
}