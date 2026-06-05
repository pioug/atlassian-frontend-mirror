import type { EditorState } from '@atlaskit/editor-prosemirror/state';

export const isSelectionEndOfParagraph = (state: EditorState): boolean =>
	state.selection.$to.parent.type === state.schema.nodes.paragraph &&
	state.selection.$to.pos === state.doc.resolve(state.selection.$to.pos).end();
