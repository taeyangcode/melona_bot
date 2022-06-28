import { DMChannel, GuildMember, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

async function createDMChannel(member: GuildMember): Promise<DMChannel> {
    return await member.createDM();
}

function memberTypeButtons(): MessageButton[] {
    const newMember: MessageButton = new MessageButton();
    newMember.setEmoji("👤");
    newMember.setLabel("New Member");

    const returningMember: MessageButton = new MessageButton();
    returningMember.setEmoji("👋");
    returningMember.setLabel("Returning Member");

    return [newMember, returningMember];
}

interface MessageComponents {
    embed: MessageEmbed;
    row?: MessageActionRow;
};

function welcomeMessageComponents(): MessageComponents {
    const welcomeMessage: MessageEmbed = new MessageEmbed();
    welcomeMessage.setTitle("Welcome to Melona!");
    welcomeMessage.addField("Please select your member type", "\u200b");

    const buttonRow: MessageActionRow = new MessageActionRow();
    buttonRow.addComponents(memberTypeButtons());

    return {
        embed: welcomeMessage,
        row: buttonRow
    };
}

export async function verify(member: GuildMember): Promise<void> {
    const dmChannel: DMChannel = await createDMChannel(member);

    const welcomeMessage: MessageComponents = welcomeMessageComponents();
    dmChannel.send({ embeds: [welcomeMessage.embed], components: [welcomeMessage.row!] });
}