import { IBot } from '../interfaces/IBot';
import { IEvent } from '../interfaces/IEvent';
import { Events } from 'discord.js';

export class onReady implements IEvent<Events.ClientReady> {
    name: Events.ClientReady = Events.ClientReady; 
    once = true;

    execute(client: IBot): void {
        client.getLogger().info('Bot is ready!');
    }
}