/* eslint-disable @atlaskit/volt-strict-mode/no-re-exports -- These should be re-exported as they are an external dependency */
export type {
	DecorationSource,
	//WidgetDecorationSpec,
	//InlineDecorationSpec,
	DecorationAttrs,
	EditorProps,
	DirectEditorProps,
	NodeView,
} from 'prosemirror-view';
export {
	Decoration,
	DecorationSet,
	EditorView,
	// @ts-expect-error There are some production importing this private attribute
	// see: packages/editor/editor-plugin-ai/src/config-items/markdown-to-slice.ts
	__parseFromClipboard,
} from 'prosemirror-view';
