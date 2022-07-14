import { CacheType, Client, Collection, DMChannel, GuildMember, InteractionCollector, Message, MessageActionRow, MessageActionRowComponent, MessageButton, MessageComponentInteraction, MessageEmbed, MessageOptions, TextBasedChannel, User } from "discord.js";
import { getDiscordAdminChannelID } from "../../env/env-helper.js";
import { BUTTON_ACCEPT_MEMBER_ID, BUTTON_NEW_MEMBER_ID, BUTTON_REJECT_MEMBER_ID, BUTTON_RETURNING_MEMBER_ID, BUTTON_RETURNING_MEMBER_SELECTION_ID, MessageComponents } from "./verify_h.js";

async function createDMChannel(member: GuildMember): Promise<DMChannel> {
    return await member.createDM();
}

async function getMessagesAfterTimestamp(messageID: string, channel: DMChannel, limit: number): Promise<Message[]> {
    const messageCollection: Collection<string, Message> = await channel.messages.fetch({ limit, after: messageID });
    return Array.from(messageCollection.values());
}

async function sendToAdminChannel(botClient: Client, options: MessageOptions): Promise<Message> {
    const adminChannel: TextBasedChannel | null = await botClient.channels.fetch(getDiscordAdminChannelID()) as TextBasedChannel | null;
    if (adminChannel === null) {
        throw Error("Admin Channel doesn't exist.");
    }
    return await adminChannel.send(options);
}

class AdminVerification {
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

class ReturningMemberDMVerification {
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
        const components: MessageComponents = AdminVerification.returningMemberComponents(interaction.user, replies);
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

class WelcomeMessage {
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

        const returningMemberMessageComponents: MessageComponents = ReturningMemberDMVerification.components();
        const returningMemberMessage: Message = await dmChannel.send({
            embeds: [returningMemberMessageComponents.embed],
            components: [returningMemberMessageComponents.row!]
        });
        ReturningMemberDMVerification.handler(returningMemberMessage, dmChannel);
    } 

    public static handler(message: Message, dmChannel: DMChannel): void {
        const collector: InteractionCollector<MessageComponentInteraction> = message.createMessageComponentCollector({ max: 1, time: 60000 });

        collector.on("collect", async (interaction: MessageComponentInteraction<CacheType>): Promise<void> => {
            switch (interaction.customId) {
                case BUTTON_NEW_MEMBER_ID:
                    await this.newMemberSelection(interaction);
                    break;
                
                case BUTTON_RETURNING_MEMBER_ID:
                    await this.returningMemberSelection(interaction, dmChannel);
                    break;
            }
            collector.stop();
        });
    }
}

export async function verify(member: GuildMember): Promise<void> {
    const dmChannel: DMChannel = await createDMChannel(member);

    const welcomeMessageComponents: MessageComponents = WelcomeMessage.components();
    const welcomeMessage: Message = await dmChannel.send({ 
        embeds: [welcomeMessageComponents.embed], 
        components: [welcomeMessageComponents.row!]
    });
    WelcomeMessage.handler(welcomeMessage, dmChannel);
}