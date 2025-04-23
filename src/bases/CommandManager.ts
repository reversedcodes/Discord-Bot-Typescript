import { ChatInputCommandInteraction, Collection, REST, Routes } from "discord.js";
import { ICommandManager } from "../interfaces/ICommandManager";
import { ICommand } from "../interfaces/ICommand";

export class CommandManager implements ICommandManager {
    private commands: Collection<string, ICommand> = new Collection();

    registerCommand(command: ICommand): void {
        if (!command?.data?.name || typeof command.execute !== "function") {
            return;
        }
        this.commands.set(command.data.name, command);
    }

    unregisterCommand(name: string): void {
        if (!this.commands.has(name)) return;
        this.commands.delete(name);
    }

    reloadCommand(name: string, command: ICommand): void {
        this.unregisterCommand(name);
        this.registerCommand(command);
    }

    updateCommand(name: string, updater: (cmd: ICommand) => ICommand): void {
        const existing = this.commands.get(name);
        if (!existing) return;

        const updated = updater(existing);
        if (!updated?.data?.name || typeof updated.execute !== "function") return;

        this.commands.set(name, updated);
    }

    async executeCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        const command = this.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error("Error executing command:", error);
        }
    }

    getCommandsJSON(): any[] {
        return Array.from(this.commands.values()).map((cmd) => cmd.data.toJSON());
    }

    clear(): void {
        this.commands.clear();
    }

    async uploadCommands(options: { app_id : string; token: string; guildId?: string; api_version?: string; }): Promise<void> {

        try {
            const rest = new REST({ version: options.api_version ?? "10" }).setToken(options.token);
            const body = this.getCommandsJSON();

            if (options.guildId) {
                await rest.put(Routes.applicationGuildCommands(options.app_id, options.guildId), { body });
            } else {
                await rest.put(Routes.applicationCommands(options.app_id), { body });
            }
        } catch (error) {
            console.error("Error uploading commands:", error);

        }
    }
}
