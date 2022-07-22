import { MessageButton, MessageEmbed } from "discord.js";
import { buttonId } from "./components_h";

function welcomeEmbed(): MessageEmbed {
    const embed: MessageEmbed = new MessageEmbed();
    embed.setThumbnail("Welcome to Melona!");
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