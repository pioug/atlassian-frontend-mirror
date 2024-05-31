import { Transaction } from '@atlaskit/editor-prosemirror/state';

import type { Command } from '../types/command';
import type { EditorCommand } from '../types/editor-command';
/**
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

/**
 * PassiveTransaction is used only to indicate that
 * an `EditorCommand` should return `true` but should not dispatch.
 */
export class PassiveTransaction extends Transaction {
	// This is very cheeky but this should never be used outside its intended
	// purpose - it will likely crash the editor so we should get an early warning
	// signal
	constructor() {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		super({} as any);
	}
}
