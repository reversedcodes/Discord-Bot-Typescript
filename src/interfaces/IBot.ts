import { IEventManager } from '../interfaces/IEventManager';
import { ICommandManager } from './ICommandManager';
import { ILogger } from './ILogger';

export interface IBot {
    getEventManager(): IEventManager;
    getCommandManager(): ICommandManager;
    getLogger(): ILogger;
}