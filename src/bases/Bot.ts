import { Client } from 'discord.js';
import { IBot } from '../interfaces/IBot';
import { IEventManager } from '../interfaces/IEventManager';
import { EventManager } from './EventManager';
import { ICommandManager } from '../interfaces/ICommandManager';
import { CommandManager } from './CommandManager';
import { Logger } from "./Logger";
import { BotLogger } from './BotLogger';

export class Bot extends Client implements IBot {

    private eventManager: IEventManager = new EventManager(this);
    private commandManager: ICommandManager = new CommandManager();

    public logger: Logger = new Logger({ basePath: "logs" });
    private botLogger: BotLogger = new BotLogger(this.logger);
  
    getEventManager(): IEventManager {
        return this.eventManager;
    }

    getCommandManager(): ICommandManager {
        return this.commandManager;
    }

    getLogger(): BotLogger {
        return this.botLogger;
    }
}
