import type { Command } from '../types/command';
import type { EditorCommand } from '../types/editor-command';

/**
 * Convert a EditorCommand to a standard Prosemirror Command.
 * The preferred approach to dispatching a `EditorCommand` is via the
 * `executeCommand` on `pluginInjectionAPI`. In some cases
 * the type may require a Command until we refactor this out and this
 * function is suitable for those cases.
 *
 * @param command A plugin command (a function that modifies and returns a `Transaction`)
 * @returns Command
 */
export function editorCommandToPMCommand(
  command: EditorCommand | undefined,
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
