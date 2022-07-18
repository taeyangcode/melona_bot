import { CacheType, DMChannel, InteractionCollector, Message, MessageActionRow, MessageActionRowComponent, MessageButton, MessageComponentInteraction, MessageEmbed } from "discord.js";
import { ReturningMemberVerification } from "./returning-member-verification.js";
import { BUTTON_NEW_MEMBER_ID, BUTTON_RETURNING_MEMBER_ID, MessageComponents } from "./verify_h.js";

export class WelcomeDM {
    private static embed(): MessageEmbed {
        const embed: MessageEmbed = new MessageEmbed();
        embed.setTitle("Welcome to Melona!");
        embed.setDescription("Please select your member type");

        return embed;
    }

    private static newMemberButton(): MessageButton {
        const button: MessageButton = new MessageButton();
        button.setEmoji("👤");
        button.setLabel("New Member");
        button.setStyle("PRIMARY");
        button.setCustomId(BUTTON_NEW_MEMBER_ID);

        return button;
    }

    private static returningMemberButton(): MessageButton {
        const button: MessageButton = new MessageButton();
        button.setEmoji("👋");
        button.setLabel("Returning Member");
        button.setStyle("PRIMARY");
        button.setCustomId(BUTTON_RETURNING_MEMBER_ID);

        return button;
    }

    private static buttonRow(): MessageActionRow<MessageActionRowComponent> {
        const row: MessageActionRow = new MessageActionRow();
        row.addComponents(this.newMemberButton(), this.returningMemberButton());

        return row;
    }    

    public static components(): MessageComponents {
        return {
            embed: this.embed(),
            row: this.buttonRow()
        };
    }
    
    private static async newMemberSelection(interaction: MessageComponentInteraction<CacheType>): Promise<void> {

    }

    private static async returningMemberSelection(interaction: MessageComponentInteraction<CacheType>, dmChannel: DMChannel): Promise<void> {
        await interaction.deferUpdate();

        const returningMemberMessageComponents: MessageComponents = ReturningMemberVerification.components();
        const returningMemberMessage: Message = await dmChannel.send({
            embeds: [returningMemberMessageComponents.embed],
            components: [returningMemberMessageComponents.row!]
        });
        ReturningMemberVerification.handler(returningMemberMessage, dmChannel);
    } 

    public static handler(message: Message, dmChannel: DMChannel): void {
        const collector: InteractionCollector<MessageComponentInteraction> = message.createMessageComponentCollector({ max: 1, time: 60000 });

        collector.on("collect", async (interaction: MessageComponentInteraction<CacheType>): Promise<void> => {
            if (interaction.customId === BUTTON_NEW_MEMBER_ID) {
                await this.newMemberSelection(interaction);
                collector.stop();
            }
            else if (interaction.customId === BUTTON_RETURNING_MEMBER_ID) {
                await this.returningMemberSelection(interaction, dmChannel);
                collector.stop();
            }
        });
    }
}