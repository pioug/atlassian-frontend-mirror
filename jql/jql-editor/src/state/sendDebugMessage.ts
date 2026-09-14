import { type EditorState } from '@atlaskit/editor-prosemirror/state';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';

import { getNodeText } from '../utils/document-text/getNodeText';

import { type DebugMessageEventAttribute } from './types';

const getDebugSelectionAttributes = (): {
	[key: string]: DebugMessageEventAttribute;
} => {
	const selection = document.getSelection();
	if (selection === null || selection.type === 'None') {
		return {};
	}

	return {
		anchorOffset: selection.anchorOffset,
		anchorNodeText: selection.anchorNode?.textContent,
		anchorNodeName: selection.anchorNode?.nodeName,
		focusOffset: selection.focusOffset,
		focusNodeText: selection.focusNode?.textContent,
		focusNodeName: selection.focusNode?.nodeName,
	};
};

export const sendDebugMessage = (
	message: string,
	editorView: EditorView,
	editorState: EditorState,
	onDebugUnsafeMessage?: (
		message: string,
		event: { [key: string]: DebugMessageEventAttribute },
	) => void,
	eventAttributes?: { [key: string]: DebugMessageEventAttribute },
): void => {
	if (!onDebugUnsafeMessage) {
		return;
	}

	try {
		const editorViewStateText = getNodeText(
			editorView.state.doc,
			0,
			editorView.state.doc.content.size,
		);
		const editorViewStateJson = JSON.stringify(editorView.state.toJSON());
		const editorStateJson = JSON.stringify(editorState.toJSON());
		const editorViewHtml = editorView.dom.innerHTML;

		onDebugUnsafeMessage(message, {
			editorStateJson,
			editorViewStateText,
			editorViewStateJson,
			editorViewHtml,
			...getDebugSelectionAttributes(),
			...eventAttributes,
		});
	} catch (ignored) {
		// Do nothing
	}
};
