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
