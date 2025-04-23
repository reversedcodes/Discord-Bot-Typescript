import { IEvent } from '../interfaces/IEvent';
import { Client, Events } from 'discord.js';

export class onReady implements IEvent<Events.ClientReady> {
    name: Events.ClientReady = Events.ClientReady; 
    once = true;

    execute(client: Client): void {
        
    }
}