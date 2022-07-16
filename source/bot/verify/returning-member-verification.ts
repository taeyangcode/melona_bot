import { MessageEmbed, MessageButton, MessageActionRow, MessageActionRowComponent, MessageComponentInteraction, CacheType, Message, DMChannel, InteractionCollector } from "discord.js";
import { VerificationMessage } from "./verification-message.js";
import { BUTTON_RETURNING_MEMBER_SELECTION_ID, getMessagesAfterTimestamp, sendToAdminChannel, MessageComponents } from "./verify_h.js";

export class ReturningMemberVerification {
    private static embed(): MessageEmbed {
        const embed: MessageEmbed = new MessageEmbed();
        embed.setTitle("Welcome Back!");
        embed.setDescription(
            `Please reply with any additional information that would help staff identify that you are returning member (E.g. previous aliases, Discord tags, etc.), then click the \`Done\` button.`
        );
        embed.setFooter({ text: "Note: Only the most recent five replies will be recorded upon pressing done." });

        return embed;
    } 

    private static doneButton(): MessageButton {
        const button: MessageButton = new MessageButton();
        button.setEmoji("✅");
        button.setLabel("Done");
        button.setStyle("SUCCESS");
        button.setCustomId(BUTTON_RETURNING_MEMBER_SELECTION_ID);

        return button;
    }

    private static buttonRow(): MessageActionRow<MessageActionRowComponent> {
        const row: MessageActionRow = new MessageActionRow();
        row.addComponents(this.doneButton());

        return row;
    }

    public static components(): MessageComponents {
        return {
            embed: this.embed(),
            row: this.buttonRow()
        };
    }

    private static async sendVerificationToAdminChannel(interaction: MessageComponentInteraction<CacheType>, message: Message, dmChannel: DMChannel): Promise<void> {
        await interaction.deferUpdate();

        const replies: Message[] = await getMessagesAfterTimestamp(message.id, dmChannel, 5);
        const components: MessageComponents = VerificationMessage.returningMemberComponents(interaction.user, replies);
        const verificationMessage: Message = await sendToAdminChannel(message.client, {
            embeds: [components.embed],
            components: [components.row!]
        });
    }

    public static handler(message: Message, dmChannel: DMChannel): void {
        const collector: InteractionCollector<MessageComponentInteraction> = message.createMessageComponentCollector({ max: 1, time: 120000 });
        collector.on("collect", async (interaction: MessageComponentInteraction<CacheType>): Promise<void> => {
            if (interaction.customId === BUTTON_RETURNING_MEMBER_SELECTION_ID) {
                this.sendVerificationToAdminChannel(interaction, message, dmChannel);
            }
        });
    }
}