import { type EditorView } from '@atlaskit/editor-prosemirror/view';

import getDocumentPosition from '../plugins/common/get-document-position';

import { type AutocompletePosition } from './types';

export const getAutocompletePosition = (
	editorView: EditorView,
	replacePositionStart: number,
): AutocompletePosition => {
	const { doc, selection } = editorView.state;
	const documentPosition = getDocumentPosition(doc, replacePositionStart);
	const { left } = editorView.coordsAtPos(documentPosition);
	// Vertically position autocomplete relative to selection end
	const { bottom } = editorView.coordsAtPos(selection.to);
	return { top: bottom, left };
};
