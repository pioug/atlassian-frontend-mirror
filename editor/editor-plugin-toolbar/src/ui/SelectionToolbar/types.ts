import { type EditorView } from '@atlaskit/editor-prosemirror/view';

export type Position = {
	left?: number;
	top?: number;
};

export type CalculateToolbarPosition = (editorView: EditorView, position: Position) => Position;
