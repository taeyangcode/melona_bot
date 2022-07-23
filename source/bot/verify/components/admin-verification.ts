import { DMChannel, InteractionCollector, Message, MessageActionRow, MessageComponentInteraction, MessageEmbed, Snowflake, User } from "discord.js";
import { acceptButton, banButton, buttonId, createMessageActionRow, getSubsequentMessages, kickButton, MemberType, MessageComponents } from "./components_h";

const memberTypeToTitle: (type: MemberType) => string = (type: MemberType) => type === "New" ? "New Member" : "Returning Member";

async function adminVerificationEmbed(memberTag: User | string, memberType: MemberType, dmChannel: DMChannel, applicationMessageId: Snowflake): Promise<MessageEmbed> {
    const embed: MessageEmbed = new MessageEmbed();
    embed.setTitle(`${memberTypeToTitle(memberType)} Application`);

    const applicationMessages: Message[] = await getSubsequentMessages(dmChannel, applicationMessageId, 5);
    embed.setDescription(`
        **Member Tag: ${memberTag}**

        **Application Messages:**
        ${applicationMessages.forEach((message: Message, index: number): void => {
            `**${index + 1}.**: ${message.content}`;
        })}
    `);

    return embed;
}

function adminVerificationButtonRow(): MessageActionRow {
    return createMessageActionRow(
        acceptButton(buttonId.acceptMember),
        kickButton(buttonId.kickMember),
        banButton(buttonId.banMember)
    );
}

async function adminVerificationMessageComponents(memberTag: User | string, memberType: MemberType, dmChannel: DMChannel, applicationMessageId: Snowflake): Promise<MessageComponents> {
    return {
        embed: await adminVerificationEmbed(memberTag, memberType, dmChannel, applicationMessageId),
        row: adminVerificationButtonRow()
    };
}

async function sendAdminVerficationMessage(memberTag: User | string, memberType: MemberType, dmChannel: DMChannel, applicationMessageId: Snowflake): Promise<Message> {
    const components: MessageComponents = await adminVerificationMessageComponents(memberTag, memberType, dmChannel, applicationMessageId);
    return await dmChannel.send({
        embeds: [components.embed],
        components: [components.row]
    });
}

async function handleAdminVerification(memberTag: User | string, memberType: MemberType, dmChannel: DMChannel, applicationMessageId: Snowflake): Promise<void> {
    const adminVerificationMessage: Message = await sendAdminVerficationMessage(memberTag, memberType, dmChannel, applicationMessageId);
    const collector: InteractionCollector<MessageComponentInteraction> = adminVerificationMessage.createMessageComponentCollector({
        max: 1
    });

    collector.on("collect", async (interaction: MessageComponentInteraction): Promise<void> => {
        await interaction.deferUpdate();

        switch (interaction.customId) {
            case buttonId.acceptMember:
                collector.stop();
                break;

            case buttonId.kickMember:
                collector.stop();
                break;

            case buttonId.banMember:
                collector.stop();
                break;
        }
    });
}