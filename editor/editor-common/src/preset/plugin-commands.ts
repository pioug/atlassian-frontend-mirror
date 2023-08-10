import type { Command } from '../types/command';
import type { PluginCommand } from '../types/plugin-command';

export function pluginCommandToPMCommand(
  command: PluginCommand | undefined,
): Command {
  return ({ tr }, dispatch) => {
    const newTr = command?.({ tr });
    if (newTr) {
      dispatch?.(newTr);
      return true;
    }
    return false;
  };
}
