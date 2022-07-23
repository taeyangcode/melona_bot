import { CacheType, CollectorOptions, DMChannel, InteractionCollector, Message, MessageActionRow, MessageActionRowComponent, MessageButton, MessageCollectorOptionsParams, MessageComponentCollectorOptions, MessageComponentInteraction, MessageEmbed } from "discord.js";
import { buttonId, createMessageActionRow, MessageComponents } from "./components_h.js";
import { handleNewMemberApplication } from "./new-member-application.js";
import { handleReturningMemberApplication } from "./returning-member-application.js";

function welcomeEmbed(): MessageEmbed {
    const embed: MessageEmbed = new MessageEmbed();
    embed.setTitle("Welcome to Melona!");
    embed.setDescription("Please select your member type");

    return embed;
}

function newMemberButton(): MessageButton {
    const button: MessageButton = new MessageButton();
    button.setEmoji("👤");
    button.setLabel("New Member");
    button.setStyle("PRIMARY");
    button.setCustomId(buttonId.newMember);

    return button;
}

function returningMemberButton(): MessageButton {
    const button: MessageButton = new MessageButton();
    button.setEmoji("👋");
    button.setLabel("Returning Member");
    button.setStyle("PRIMARY");
    button.setCustomId(buttonId.returningMember);

    return button;
}

function welcomeButtonRow(): MessageActionRow<MessageActionRowComponent> {
    return createMessageActionRow(newMemberButton(), returningMemberButton());
}

function welcomeComponents(): MessageComponents {
    return {
        embed: welcomeEmbed(),
        row: welcomeButtonRow()
    };
}

async function sendWelcomeMessage(dmChannel: DMChannel): Promise<Message> {
    const components: MessageComponents = welcomeComponents();
    return await dmChannel.send({ 
        embeds: [components.embed],
        components: [components.row]
    });
}

export async function handleMemberTypeSelection(dmChannel: DMChannel): Promise<void> {
    const message: Message = await sendWelcomeMessage(dmChannel);
    const collector: InteractionCollector<MessageComponentInteraction> = message.createMessageComponentCollector({
        max: 1,
        time: 60000
    });

    collector.on("collect", async (interaction: MessageComponentInteraction<CacheType>): Promise<void> => {
        await interaction.deferUpdate();
        
        switch (interaction.customId) {
            case buttonId.newMember:
                await handleNewMemberApplication(dmChannel);    
                collector.stop();
                break;

            case buttonId.returningMember:
                await handleReturningMemberApplication(dmChannel);
                collector.stop();
                break;
        }
    });
}