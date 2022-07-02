import { Channel } from "diagnostics_channel";
import { CacheType, Collection, DMChannel, GuildMember, InteractionCollector, Message, MessageActionRow, MessageActionRowComponent, MessageButton, MessageComponentCollectorOptions, MessageComponentInteraction, MessageEmbed, Snowflake, TextBasedChannel } from "discord.js";

async function createDMChannel(member: GuildMember): Promise<DMChannel> {
    return await member.createDM();
}

const NEW_MEMBER_ID: Readonly<string> = "NEW_MEMBER";
const RETURNING_MEMBER_ID: Readonly<string> = "RETURNING_MEMBER";

function memberTypeButtons(): MessageButton[] {
    const newMember: MessageButton = new MessageButton();
    newMember.setEmoji("👤");
    newMember.setLabel("New Member");
    newMember.setStyle("PRIMARY");
    newMember.setCustomId(NEW_MEMBER_ID)

    const returningMember: MessageButton = new MessageButton();
    returningMember.setEmoji("👋");
    returningMember.setLabel("Returning Member");
    returningMember.setStyle("PRIMARY");
    returningMember.setCustomId(RETURNING_MEMBER_ID);

    return [newMember, returningMember];
}

interface MessageComponents {
    embed: MessageEmbed;
    row?: MessageActionRow;
};

function getWelcomeMessageComponents(): MessageComponents {
    const welcomeMessage: MessageEmbed = new MessageEmbed();
    welcomeMessage.setTitle("Welcome to Melona!");
    welcomeMessage.setDescription("Please select your member type");

    const buttonRow: MessageActionRow = new MessageActionRow();
    buttonRow.addComponents(memberTypeButtons());

    return {
        embed: welcomeMessage,
        row: buttonRow
    };
}
 
// function disableMessageButtons(message: Message): void {
//     const actionRows: MessageActionRow<MessageActionRowComponent>[] = message.components;
//     actionRows.forEach((actionRow: MessageActionRow<MessageActionRowComponent>): void => {
//         actionRow.components.forEach((component: MessageActionRowComponent): void => {
//             if (component.type === "BUTTON") {
//                 console.log("DISABLED BUTTON");
//                 component.setDisabled(true);
//             }
//         });
//     });
// }

const RETURNING_MEMBER_DONE_ID: Readonly<string> = "RM_DONE";

function getReturningMemberMessageComponents(): MessageComponents {
    const message: MessageEmbed = new MessageEmbed();
    message.setTitle("Welcome Back!");
    message.setDescription(
        `Please reply with any additional information that would help staff identify that you are returning member (E.g. previous aliases, Discord tags, etc.), then click the \`Done\` button.`
    );

    const buttonRow: MessageActionRow = new MessageActionRow();
    const doneButton: MessageButton = new MessageButton();
    doneButton.setEmoji("✅");
    doneButton.setLabel("Done");
    doneButton.setStyle("SUCCESS");
    doneButton.setCustomId(RETURNING_MEMBER_DONE_ID);
    buttonRow.addComponents(doneButton);

    return {
        embed: message,
        row: buttonRow
    };
}

async function getMessagesAfterTimestamp(messageID: string, channel: DMChannel, limit: number): Promise<Message[]> {
    return Array.from((await channel.messages.fetch({ limit, after: messageID })).values());
}

function returningMemberMessageButtonHandler(returningMemberMessage: Message, dmChannel: DMChannel): void {
    const collector = returningMemberMessage.createMessageComponentCollector({ max: 1, time: 120000 });
    collector.on("collect", async (interaction: MessageComponentInteraction<CacheType>): Promise<void> => {
        const replies: Message[] = await getMessagesAfterTimestamp(returningMemberMessage.id, dmChannel, 5);
        for (const reply of replies) {
            console.log(reply.content);
        }
    });
}

function welcomeMessageButtonHandler(welcomeMessage: Message, dmChannel: DMChannel): void {
    const collector = welcomeMessage.createMessageComponentCollector({ max: 1, time: 60000 });
    collector.on("collect", async (interaction: MessageComponentInteraction<CacheType>): Promise<void> => {
        if (interaction.customId === NEW_MEMBER_ID) {
            
        }
        else if (interaction.customId === RETURNING_MEMBER_ID) {
            const returningMemberMessageComponents: MessageComponents = getReturningMemberMessageComponents();
            const returningMemberMessage: Message = await dmChannel.send({
                embeds: [returningMemberMessageComponents.embed],
                components: [returningMemberMessageComponents.row!]
            });
            await interaction.deferUpdate();

            returningMemberMessageButtonHandler(returningMemberMessage, dmChannel);
        }
        collector.stop();
    });
}


export async function verify(member: GuildMember): Promise<void> {
    const dmChannel: DMChannel = await createDMChannel(member);

    const welcomeMessageComponents: MessageComponents = getWelcomeMessageComponents();
    const welcomeMessage: Message = await dmChannel.send({ 
        embeds: [welcomeMessageComponents.embed], 
        components: [welcomeMessageComponents.row!]
    });
    welcomeMessageButtonHandler(welcomeMessage, dmChannel);
}