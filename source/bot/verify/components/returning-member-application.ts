import { CacheType, DMChannel, InteractionCollector, Message, MessageActionRow, MessageCollectorOptionsParams, MessageComponentCollectorOptions, MessageComponentInteraction, MessageEmbed } from "discord.js";
import { buttonId, createMessageActionRow, doneButton, MessageComponents } from "./components_h.js";

function returningMemberApplicationEmbed(): MessageEmbed {
    const embed: MessageEmbed = new MessageEmbed();
    embed.setTitle("Returning Member Application");
    embed.setDescription(
        `Please reply with any additional information that would help staff identify that you are returning member (E.g. previous aliases, Discord tags, etc.), then click the \`Done\` button.`
    );
    embed.setFooter({ text: "Note: Only the most recent five replies will be recorded upon pressing done." });

    return embed;
}

function returningMemberApplicationButtonRow(): MessageActionRow {
    return createMessageActionRow(doneButton(buttonId.returningMemberApplicationDone));
}

function returningMemberApplicationComponents(): MessageComponents {
    return {
        embed: returningMemberApplicationEmbed(),
        row: returningMemberApplicationButtonRow()
    };
}

async function sendReturningMemberApplication(dmChannel: DMChannel): Promise<Message> {
    const components: MessageComponents = returningMemberApplicationComponents();
    return await dmChannel.send({
        embeds: [components.embed],
        components: [components.row]
    });
}

export async function handleReturningMemberApplication(dmChannel: DMChannel): Promise<void> {
    const message: Message = await sendReturningMemberApplication(dmChannel);
    const collector: InteractionCollector<MessageComponentInteraction> = message.createMessageComponentCollector({
        max: 1,
        time: 120000
    });
    
    collector.on("collect", async (interaction: MessageComponentInteraction<CacheType>): Promise<void> => {
        await interaction.deferUpdate();
        if (interaction.customId === buttonId.returningMemberApplicationDone) {
            collector.stop();
        }
    });
}