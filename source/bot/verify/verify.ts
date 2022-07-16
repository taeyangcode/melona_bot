import { GuildMember, DMChannel, Message } from "discord.js";
import { createDMChannel, MessageComponents } from "./verify_h.js";
import { WelcomeDM } from "./welcome-dm.js";

export async function verify(member: GuildMember): Promise<void> {
    const dmChannel: DMChannel = await createDMChannel(member);

    const welcomeMessageComponents: MessageComponents = WelcomeDM.components();
    const welcomeMessage: Message = await dmChannel.send({ 
        embeds: [welcomeMessageComponents.embed], 
        components: [welcomeMessageComponents.row!]
    });
    WelcomeDM.handler(welcomeMessage, dmChannel);
}