import { GuildMember, DMChannel } from "discord.js";
import { handleMemberTypeSelection } from "./components/welcome.js";
import { createDMChannel } from "./verify_h.js";

export async function verify(member: GuildMember): Promise<void> {
    const dmChannel: DMChannel = await createDMChannel(member);
    await handleMemberTypeSelection(dmChannel);
}