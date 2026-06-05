import { Transaction } from '@atlaskit/editor-prosemirror/state';

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
