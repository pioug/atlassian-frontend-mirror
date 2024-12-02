import { useCallback } from 'react';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export const useFocusEditor = ({ editorView }: { editorView: EditorView }) => {
	const focusEditor = useCallback(() => {
		// use setTimeout to run this async after the call
		setTimeout(() => editorView.focus(), 0);
	}, [editorView]);
	return focusEditor;
};
