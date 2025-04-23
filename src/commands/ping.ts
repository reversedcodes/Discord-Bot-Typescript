import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

import { ICommand } from '../interfaces/ICommand';
  
export class PingCommand implements ICommand {
    
    public data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription('Antwortet mit Pong!')
  
    public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply(`🏓 Pong! Latenz: ${Date.now() - interaction.createdTimestamp}ms`);
    }
}
  