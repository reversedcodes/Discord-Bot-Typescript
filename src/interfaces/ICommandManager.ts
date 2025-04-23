import { ICommand } from './ICommand';
import { ChatInputCommandInteraction } from 'discord.js';

export interface ICommandManager {
    registerCommand(command: ICommand): void;
    unregisterCommand(name: string): void;
    reloadCommand(name: string, command: ICommand): void;
    updateCommand(name: string, updater: (cmd: ICommand) => ICommand): void;
    executeCommand(interaction: ChatInputCommandInteraction): Promise<void>;
    getCommandsJSON(): any[];
    uploadCommands(options: {
        app_id: string;
        token: string;
        guildId?: string;
        api_version?: string;
    }): Promise<void>;
    clear(): void;
}