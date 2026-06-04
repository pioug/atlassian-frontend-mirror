import { tintDirtyTransaction } from '@atlaskit/editor-common/collab';
import { addParagraphAtEnd } from '@atlaskit/editor-common/commands';
import { setSelectionTopLevelBlocks } from '@atlaskit/editor-common/selection';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export const outsideProsemirrorEditorClickHandler = (
	view: EditorView,
	event: React.MouseEvent<HTMLElement, MouseEvent>,
): void => {
	const { dispatch, dom, state } = view;
	const { tr } = state;
	const isEditorFocused = !!view?.hasFocus?.();
	const isBottomAreaClicked = event.clientY > dom.getBoundingClientRect().bottom;

	if (isBottomAreaClicked) {
		tr.setMeta('outsideProsemirrorEditorClicked', true);
		addParagraphAtEnd(tr);
	}

	setSelectionTopLevelBlocks(
		tr,
		event,
		// Ignored via go/ees005
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		dom as HTMLElement,
		view.posAtCoords.bind(view),
		isEditorFocused,
	);

	tintDirtyTransaction(tr);

	if (!tr.docChanged && !tr.selectionSet) {
		return;
	}

	if (dispatch) {
		dispatch(tr);
	}

	view.focus();
	event.preventDefault();
};
