
import type { Command } from '../types/command';
import type { EditorCommand } from '../types/editor-command';

import { PassiveTransaction } from './PassiveTransaction';/**
 * Convert a EditorCommand to a standard Prosemirror Command.
 * The preferred approach to dispatching a `EditorCommand` is via the
 * `core.actions.execute` on `pluginInjectionAPI`. In some cases
 * the type may require a Command until we refactor this out and this
 * function is suitable for those cases.
 *
 * @param command A plugin command (a function that modifies and returns a `Transaction`)
 * @returns Command
 */
export function editorCommandToPMCommand(command: EditorCommand | undefined): Command {
	return ({ tr }, dispatch) => {
		const newTr = command?.({ tr });
		if (!newTr) {
			return false;
		}
		if (newTr instanceof PassiveTransaction) {
			return true;
		}
		dispatch?.(newTr);
		return true;
	};
}
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { PassiveTransaction } from './PassiveTransaction';
