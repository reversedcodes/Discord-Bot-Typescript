import { ClientEvents } from "discord.js";

export interface IEvent<K extends keyof ClientEvents = keyof ClientEvents> {
    name: K;
    execute: (...args: ClientEvents[K]) => void;
    once?: boolean;
    priority?: number;
}

