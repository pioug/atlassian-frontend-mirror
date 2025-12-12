export type {
	PluginSpec,
	// @ts-ignore - These types are augmented via typings/prosemirror-state.d.ts and are available in the built package
	ReadonlyTransaction,
	// @ts-ignore - These types are augmented via typings/prosemirror-state.d.ts and are available in the built package
	SafePluginSpec,
	// @ts-ignore - These types are augmented via typings/prosemirror-state.d.ts and are available in the built package
	SafeStateField,
	SelectionBookmark,
	StateField,
} from 'prosemirror-state';

export {
	AllSelection,
	EditorState,
	NodeSelection,
	Plugin,
	PluginKey,
	Selection,
	SelectionRange,
	TextSelection,
	Transaction,
} from 'prosemirror-state';
