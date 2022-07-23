import { CacheType, DMChannel, InteractionCollector, Message, MessageActionRow, MessageCollectorOptionsParams, MessageComponentInteraction, MessageEmbed } from "discord.js";
import { buttonId, createMessageActionRow, doneButton, MessageComponents } from "./components_h.js";

function newMemberApplicationEmbed(): MessageEmbed {
    const embed: MessageEmbed = new MessageEmbed();
    embed.setTitle("New Member Application");
    embed.setDescription(`
        Please supply a response for each field in *at most* five total replies (further replies will be ignored by the bot), then click \`Done\`.

        **1️. Name**
        **2️. Age**
        **3️. Country**
        **4️. Ethnicity**
        **5️. Instagram ID** 
    `);
    embed.setFooter({ text: "Note: In the case you do not have, or do not wish to supply your Instagram ID, alternate verification will be required!" });
    
    return embed;
}

function newMemberApplicationButtonRow(): MessageActionRow {
    return createMessageActionRow(
        doneButton(buttonId.returningMemberApplicationDone)
    );
}

function newMemberApplicationComponents(): MessageComponents {
    return {
        embed: newMemberApplicationEmbed(),
        row: newMemberApplicationButtonRow()
    };
}

async function sendNewMemberApplicationMessage(dmChannel: DMChannel): Promise<Message> {
    const components: MessageComponents = newMemberApplicationComponents();
    return await dmChannel.send({
        embeds: [components.embed],
        components: [components.row]
    });
}

export async function handleNewMemberApplication(dmChannel: DMChannel): Promise<void> {
    const message: Message =  await sendNewMemberApplicationMessage(dmChannel);
    const collector: InteractionCollector<MessageComponentInteraction> = message.createMessageComponentCollector({
        max: 1,
        time: 120000
    });

    collector.on("collect", async (interaction: MessageComponentInteraction<CacheType>): Promise<void> => {
        await interaction.deferUpdate();

        if (interaction.customId === buttonId.newMemberApplicationDone) {
            collector.stop();
        }
    });
}