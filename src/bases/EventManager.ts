import { Client, ClientEvents } from 'discord.js';
import { IEventManager } from '../interfaces/IEventManager';
import { IEvent } from '../interfaces/IEvent';

type Handler<K extends keyof ClientEvents> = {
    event: IEvent<K>;
    handler: (...args: ClientEvents[K]) => void;
};

export class EventManager implements IEventManager {
    private handlers = new Map<keyof ClientEvents, Handler<any>[]>();
    constructor(private client: Client) {}
    
    register<K extends keyof ClientEvents>(event: IEvent<K>): void {
        const handler = (...args: ClientEvents[K]) => { event.execute(...args); };
    
        const existing = this.handlers.get(event.name) || [];
        this.handlers.set(event.name, [...existing, { event, handler }]);
    
        if (event.once) {
            this.client.once(event.name, handler);
        } else {
            this.client.on(event.name, handler);
        }
    }
    unregister<K extends keyof ClientEvents>(event: IEvent<K>): void {
        const list = this.handlers.get(event.name);
        if (!list) return;

        const match = list.find(h => h.event === event);
        if (!match) return;

        this.client.off(event.name, match.handler);

        const remaining = list.filter(h => h !== match);
        this.handlers.set(event.name, remaining);
    }

    clear(): void {
        for (const [name, handlerList] of this.handlers.entries()) {
            for (const { handler } of handlerList) {
                this.client.off(name, handler);
            }
        }
        this.handlers.clear();
    }
}
