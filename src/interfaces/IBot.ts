import { BotLogger } from '../bases/BotLogger';
import { IEventManager } from '../interfaces/IEventManager';
import { ICommandManager } from './ICommandManager';
import { Client } from 'discord.js';


export interface IBot extends Client{
    getEventManager(): IEventManager;
    getCommandManager(): ICommandManager;
    getLogger(): BotLogger;
}