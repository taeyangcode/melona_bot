import { CacheType, DMChannel, GuildMember, InteractionCollector, Message, MessageActionRow, MessageActionRowComponent, MessageButton, MessageComponentCollectorOptions, MessageComponentInteraction, MessageEmbed } from "discord.js";

async function createDMChannel(member: GuildMember): Promise<DMChannel> {
    return await member.createDM();
}

const _newMemberID: Readonly<string> = "NEW_MEMBER";
const _returningMemberID: Readonly<string> = "RETURNING_MEMBER";

function memberTypeButtons(): MessageButton[] {
    const newMember: MessageButton = new MessageButton();
    newMember.setEmoji("👤");
    newMember.setLabel("New Member");
    newMember.setStyle("PRIMARY");
    newMember.setCustomId(_newMemberID)

    const returningMember: MessageButton = new MessageButton();
    returningMember.setEmoji("👋");
    returningMember.setLabel("Returning Member");
    returningMember.setStyle("PRIMARY");
    returningMember.setCustomId(_returningMemberID);

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

interface MessageButtonDisabledData {
    customID: string;
    setDisabled: boolean;
};

interface MessageButtonState {
    message: Message;
    buttonData: MessageButtonDisabledData[]; 
};

function setMessageButtonState(buttonState: MessageButtonState): void {
    const actionRows: MessageActionRow<MessageActionRowComponent>[] = buttonState.message.components;
    actionRows.forEach((actionRow: MessageActionRow<MessageActionRowComponent>): void => {
        actionRow.components.forEach((component: MessageActionRowComponent): void => {
            if (component.type === "BUTTON") {
                buttonState.buttonData.forEach((button: MessageButtonDisabledData): void => {
                    if (button.customID === component.customId) {
                        component.setDisabled(button.setDisabled);
                    }
                });
            }
        });
    });
}

async function welcomeMessageButtonHandler(welcomeMessage: Message): Promise<void> {
    const collector = welcomeMessage.createMessageComponentCollector();
    collector.on("collect", (interaction: MessageComponentInteraction<CacheType>): void => {
        if (interaction.customId === _newMemberID) {

        }
        else if (interaction.customId === _returningMemberID) {

        }
    });
}


export async function verify(member: GuildMember): Promise<void> {
    const dmChannel: DMChannel = await createDMChannel(member);

    const welcomeMessageComponents: MessageComponents = getWelcomeMessageComponents();
    const welcomeMessage: Message = await dmChannel.send({ 
        embeds: [welcomeMessageComponents.embed], 
        components: [welcomeMessageComponents.row!]
    });
}