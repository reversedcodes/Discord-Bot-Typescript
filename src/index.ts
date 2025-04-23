import { Events, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import { Bot } from "./bases/Bot";
import { onReady } from "./events/onReady";
import { PingCommand } from "./commands/ping";

const client = new Bot({ intents: 53608447 });

config();

function processExitHandler() {

    const logger = client.getLogger();

    process.on('SIGINT', async () => {
        await logger.flush();
        process.exit();
    });

    process.on('SIGTERM', async () => {
        await logger.flush();
        process.exit();
    });

    process.on('uncaughtException', async (err) => {
        await logger.flush();
        process.exit(1);
    });

    process.on('unhandledRejection', async (reason) => {
        await logger.flush();
        process.exit(1);
    });
}

async function init_events() {
    client.getEventManager().register(new onReady());
    client.getEventManager().register({
        name: Events.InteractionCreate,
        once: false,
        execute: async (interaction) => {
            if (interaction.isChatInputCommand()) {
                await client.getCommandManager().executeCommand(interaction);
                return;
            }
        }
    });
}

async function init_commands() {
    client.getCommandManager().registerCommand(new PingCommand());
    client.getCommandManager().uploadCommands({ token: process.env.TOKEN!, app_id: process.env.APP_ID!, api_version: "9" })
}

async function main() {
    processExitHandler();
    await init_commands();
    await init_events();

    client.getLogger().flushEvery(7000);

    await client.login(process.env.TOKEN!);
}

main();