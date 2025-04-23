import { ClientEvents } from 'discord.js';
import { IEvent } from './IEvent';

export interface IEventManager {
    register<K extends keyof ClientEvents>(event: IEvent<K>): void;
    unregister<K extends keyof ClientEvents>(event: IEvent<K>): void;
    clear(): void;
}