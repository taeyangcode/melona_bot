import { Client, Intents } from "discord.js";

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
            Intents.FLAGS.GUILD_MESSAGES
        );
        return intents;
    }

    private setupBotEvents(): void {
        this.client.on("ready", (client: Client): void => {
            console.log(`${client.user?.tag} ready at ${client.readyTimestamp}`);
        });
    }
}