import type { Command } from '../types/command';
import type { PluginCommand } from '../types/plugin-command';

/**
 * Convert a PluginCommand to a standard Prosemirror Command.
 * The preferred approach to dispatching a `PluginCommand` is via the
 * `executeCommand` on `pluginInjectionAPI`. In some cases
 * the type may require a Command until we refactor this out and this
 * function is suitable for those cases.
 *
 * @param command A plugin command (a function that modifies and returns a `Transaction`)
 * @returns Command
 */
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
