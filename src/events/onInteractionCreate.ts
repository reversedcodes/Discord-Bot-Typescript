import { CacheType, Events, Interaction } from "discord.js";
import { IEvent } from "../interfaces/IEvent";
import { IBot } from "../interfaces/IBot";

export class onInteractionCreate implements IEvent<Events.InteractionCreate> {
    name: Events.InteractionCreate = Events.InteractionCreate;
    once: boolean = false;

    async execute(bot: IBot, interaction: Interaction<CacheType>): Promise<void> {
        if(interaction.isChatInputCommand()) {
            await bot.getCommandManager().executeCommand(interaction);
            return;
        }
    }
}