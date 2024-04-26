import { CommandParser } from './command-parcer.js';
import { Command } from './commands/command.interface.js';

type CommandCollection = Record<string, Command>;

export class CLIApplication {
  private commands: CommandCollection = {};

  constructor(
    private readonly defaultCommand: string = '--help'
  ) { }

  public registerCommands(commandsList: Command[]): void {
    commandsList.forEach((command) => {
      if (Object.hasOwn(this.commands, command.getName())) {
        throw new Error(`Command ${command.getName()} is already registered`);
      }

      this.commands[command.getName()] = command;
    });
  }

  public getCommand(commandName: string): Command {
    return this.commands[commandName] ?? this.getDefaultCommand();
  }

  public getDefaultCommand(): Command {
    if (!this.commands[this.defaultCommand]) {
      throw new Error(`The default command ${this.defaultCommand} is not registered`);
    }

    return this.commands[this.defaultCommand];
  }

  public processCommand(argv: string[]): void {
    const parcedCommand = CommandParser.parse(argv);
    const [commandName] = Object.keys(parcedCommand);
    console.log(commandName);
    const command = this.getCommand(commandName);
    const commandArguments = parcedCommand[commandName] ?? [];
    command.execute(...commandArguments);
  }
}
