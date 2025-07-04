import { TextSelection, type Selection } from '@atlaskit/editor-prosemirror/state';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';

export function isValidSelection(selection: Selection): boolean {
	if (selection.empty) {
		return false;
	}

	const { $anchor, $head } = selection;

	// Head must be at the start of its parent node's content
	if ($head.parentOffset !== 0) {
		return false;
	}

	// Head must be nested (e.g., in a panel > paragraph, not directly in doc)
	if ($head.depth <= 1) {
		return false;
	}

	// Head must be in the first top-level block (before depth 1 is 0)
	if ($head.before(1) !== 0) {
		return false;
	}

	// Selection must not span within a shared deeper structure
	if ($head.sharedDepth($anchor.pos) !== 0) {
		return false;
	}

	// Head must be in the first block at every level
	let isFirstBlockInTree = true;
	for (let i = $head.depth - 1; i >= 0; i--) {
		if ($head.index(i) !== 0) {
			isFirstBlockInTree = false;
			break;
		}
	}

	if (!isFirstBlockInTree) {
		return false;
	}

	return true;
}

export function onMouseOut(view: EditorView, event: MouseEvent): boolean {
	// Only trigger during a mouse drag
	if (event.buttons === 0) {
		return false;
	}

	if (view.state.selection instanceof TextSelection && isValidSelection(view.state.selection)) {
		// Set selection with head at document start (position 0)
		const selection = new TextSelection(
			view.state.doc.resolve(view.state.selection.$anchor.pos),
			view.state.doc.resolve(0),
		);
		view.dispatch(view.state.tr.setSelection(selection));
		return true;
	}

	return false;
}
