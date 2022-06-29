import { Client, GuildMember, Intents } from "discord.js";
import { verify } from "./verify.js";

export class MelonaBot {
    private client: Client;

    public constructor(botToken: string) {
        this.client = new Client({ intents: this.botIntents() });
        this.setupBotEvents();
        this.client.login(botToken);
    }

    public getClient(): Readonly<Client> {
        return this.client;
    } 

    private botIntents(): Intents {
        const intents: Intents = new Intents();
        intents.add(
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_PRESENCES
        );
        return intents;
    }

    private ready(): void {
        this.client.on("ready", (client: Client): void => {
            console.log(`${client.user?.tag} ready at ${client.readyTimestamp}`);
        });
    }

    private guildMemberAdd(): void {
        this.client.on("guildMemberAdd", (member: GuildMember): void => {
            console.log(`${member.user.tag} has joined Melona!`);
            verify(member);
        });
    }

    private setupBotEvents(): void {
        this.ready();
        this.guildMemberAdd();
    }
}