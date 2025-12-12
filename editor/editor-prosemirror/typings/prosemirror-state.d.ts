import type { EditorState, PluginSpec, Transaction } from 'prosemirror-state';

declare module 'prosemirror-state' {
	export type ReadonlyTransaction = Pick<
		Transaction,
		/** Safe transforms */
		| 'doc'
		| 'steps'
		| 'docs'
		| 'mapping'
		| 'before'
		| 'docChanged'
		| 'liftTarget'
		| 'canSplit'
		| 'canJoin'
		| 'joinPoint'
		| 'insertPoint'
		| 'dropPoint'

		/** Safe transactions */
		| 'time'
		| 'storedMarks'
		| 'selection'
		| 'selectionSet'
		| 'storedMarksSet'
		| 'getMeta'
		| 'isGeneric'
		| 'scrollIntoView'
	>;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export interface SafeStateField<T = any> extends StateField<T> {
		apply: (tr: ReadonlyTransaction, value: T, oldState: EditorState, newState: EditorState) => T;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export interface SafePluginSpec<T = any> extends PluginSpec<T> {
		state?: SafeStateField<T> | null;
	}

	// extend base type to allow plugins to infer ReadonlyTransaction
	// even if they're not declared as a SafePlugin
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export interface StateField<T = any> extends StateField<T> {
		apply: (tr: ReadonlyTransaction, value: T, oldState: EditorState, newState: EditorState) => T;
	}
}
