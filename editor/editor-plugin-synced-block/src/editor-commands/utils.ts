import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { NodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export const findBodiedSyncBlockByLocalId = (
	state: EditorState,
	localId: string,
): NodeWithPos | undefined => {
	let result: NodeWithPos | undefined;

	state.doc.descendants((node, pos) => {
		if (result) {
			return false;
		}

		if (node.type === state.schema.nodes.bodiedSyncBlock && node.attrs.localId === localId) {
			result = { node, pos };
			return false;
		}

		return true;
	});

	return result;
};

export const pasteSyncBlockHTMLContent = (
	contentDOM: HTMLElement | DocumentFragment,
	view: EditorView,
): boolean => {
	const tmpDiv = document.createElement('div');
	tmpDiv.appendChild(contentDOM);

	// This is required so that prosemirror can read the fragment context and slice properly
	if (tmpDiv.firstChild instanceof HTMLElement) {
		tmpDiv.firstChild.setAttribute('data-pm-slice', '0 0 []');

		// As per requirement - when unsync reference block, it should render its content as copy&paste behaviour
		// Hence here we call pasteHTML to evoke editor paste logic that handles any unsupported nodes/marks
		return view.pasteHTML(tmpDiv.innerHTML);
	}

	return false;
};
