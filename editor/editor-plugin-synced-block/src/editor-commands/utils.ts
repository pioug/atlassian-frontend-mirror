import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export const pasteSyncBlockHTMLContent = (
	contentDOM: HTMLElement | DocumentFragment,
	view: EditorView,
) => {
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
