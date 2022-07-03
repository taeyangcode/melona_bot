import { CacheType, Client, Collection, DMChannel, GuildMember, Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed, MessageOptions, MessagePayload, PartialTextBasedChannelFields, TextBasedChannel, User, WebhookMessageOptions } from "discord.js";
import { getDiscordAdminChannelID } from "../env/env-helper.js";

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

const RETURNING_MEMBER_DONE_ID: Readonly<string> = "RM_DONE";

function getReturningMemberMessageComponents(): MessageComponents {
    const message: MessageEmbed = new MessageEmbed();
    message.setTitle("Welcome Back!");
    message.setDescription(
        `Please reply with any additional information that would help staff identify that you are returning member (E.g. previous aliases, Discord tags, etc.), then click the \`Done\` button.`
    );
    message.setFooter({ text: "Note: Only the most recent five replies will be recorded upon pressing done." });

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
    const messageCollection: Collection<string, Message> = await channel.messages.fetch({ limit, after: messageID });
    return Array.from(messageCollection.values());
}

async function sendToAdminChannel(botClient: Client, options: MessageOptions): Promise<void> {
    const adminChannel: TextBasedChannel | null = await botClient.channels.fetch(getDiscordAdminChannelID()) as TextBasedChannel | null;
    if (adminChannel === null) {
        throw Error("Admin Channel doesn't exist.");
    }
    await adminChannel.send(options);
}

function getReturningMemberAdminEmbed(user: User, messages: Message[]): MessageEmbed {
    const embed: MessageEmbed = new MessageEmbed();
    embed.setTitle("New Returning Member Verification");
    embed.setDescription(`User: ${user}`);
    if (messages.length === 0) {
        embed.addField("User did not supply any further details.", "\u200b");
    }
    else {
        messages.reverse();
        messages.forEach((message: Message, index: number): void => {
            embed.addField(`Message ${index + 1}`, message.content);
        });
    }
    return embed;
} 

function returningMemberMessageButtonHandler(returningMemberMessage: Message, dmChannel: DMChannel): void {
    const collector = returningMemberMessage.createMessageComponentCollector({ max: 1, time: 120000 });
    collector.on("collect", async (interaction: MessageComponentInteraction<CacheType>): Promise<void> => {
        if (interaction.customId === RETURNING_MEMBER_DONE_ID) {
            await interaction.deferUpdate();
        
            const replies: Message[] = await getMessagesAfterTimestamp(returningMemberMessage.id, dmChannel, 5);
            const returningMemberAdminEmbed: MessageEmbed = getReturningMemberAdminEmbed(interaction.user, replies);
            await sendToAdminChannel(returningMemberMessage.client, {
                embeds: [returningMemberAdminEmbed]
            });
        }
    });
}

function welcomeMessageButtonHandler(welcomeMessage: Message, dmChannel: DMChannel): void {
    const collector = welcomeMessage.createMessageComponentCollector({ max: 1, time: 60000 });
    collector.on("collect", async (interaction: MessageComponentInteraction<CacheType>): Promise<void> => {
        if (interaction.customId === NEW_MEMBER_ID) {
            
        }
        else if (interaction.customId === RETURNING_MEMBER_ID) {
            await interaction.deferUpdate();

            const returningMemberMessageComponents: MessageComponents = getReturningMemberMessageComponents();
            const returningMemberMessage: Message = await dmChannel.send({
                embeds: [returningMemberMessageComponents.embed],
                components: [returningMemberMessageComponents.row!]
            });
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