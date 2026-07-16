import { useCallback } from 'react';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export const useFocusEditor = ({ editorView }: { editorView: EditorView }): (() => void) => {
	const focusEditor = useCallback(() => {
		// Use setTimeout to run this async after any DOM updates in same callback
		setTimeout(() => editorView.focus(), 0);
	}, [editorView]);
	return focusEditor;
};
