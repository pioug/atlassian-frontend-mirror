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
	// @ts-expect-error There are some tests importing this private attribute
	// see: packages/editor/editor-core/src/plugins/base/__tests__/unit/better-type-history.ts
	__serializeForClipboard,
	// @ts-expect-error There are some production importing this private attribute
	// see: packages/editor/editor-plugin-ai/src/config-items/markdown-to-slice.ts
	__parseFromClipboard,
} from 'prosemirror-view';
