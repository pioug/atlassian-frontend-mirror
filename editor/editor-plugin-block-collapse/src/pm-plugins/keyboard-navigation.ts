import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { moveSelectionToHeading, toggleHeadingInTransaction } from './commands';
import { blockCollapsePluginKey } from './plugin-key';

const findTopLevelNodePosition = (state: EditorState): number | undefined => {
	const { $head } = state.selection;
	return $head.depth > 0 ? $head.before(1) : undefined;
};

const moveToCollapsedHeading = (view: EditorView, headingPos: number): boolean => {
	const tr = view.state.tr;
	moveSelectionToHeading(tr, headingPos);
	view.dispatch(tr.scrollIntoView());
	return true;
};

export const expandHeadingOnEnter = (view: EditorView, event: KeyboardEvent): boolean => {
	if (
		event.key !== 'Enter' ||
		event.shiftKey ||
		event.ctrlKey ||
		event.metaKey ||
		event.altKey ||
		event.isComposing ||
		view.composing
	) {
		return false;
	}

	const { selection } = view.state;
	if (
		!(selection instanceof TextSelection) ||
		!selection.empty ||
		selection.$head.depth !== 1 ||
		selection.$head.parentOffset !== selection.$head.parent.content.size
	) {
		return false;
	}

	const headingPos = selection.$head.before(1);
	const pluginState = blockCollapsePluginKey.getState(view.state);
	if (!pluginState?.collapsedHeadingPositions.has(headingPos)) {
		return false;
	}

	const tr = toggleHeadingInTransaction(view.state.tr, headingPos);
	if (tr) {
		view.dispatch(tr);
	}

	// Leave the split and mark preservation to the editor's normal Enter handlers.
	return false;
};

export const handleArrowKey = (view: EditorView, event: KeyboardEvent): boolean => {
	if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
		return false;
	}

	const pluginState = blockCollapsePluginKey.getState(view.state);
	if (!pluginState?.collapsedHeadingPositions.size) {
		return false;
	}

	const currentNodePos = findTopLevelNodePosition(view.state);
	if (currentNodePos === undefined) {
		return false;
	}

	if (event.key === 'ArrowDown' && pluginState.collapsedHeadingPositions.has(currentNodePos)) {
		const headingNode = view.state.doc.nodeAt(currentNodePos);
		const sectionEnd = pluginState.collapsedSectionEnds.get(currentNodePos);
		if (
			!headingNode ||
			sectionEnd === undefined ||
			view.state.selection.$head.parentOffset !== headingNode.content.size
		) {
			return false;
		}

		const nextSelection = TextSelection.near(view.state.doc.resolve(sectionEnd), 1);
		if (nextSelection.from === view.state.selection.from) {
			return false;
		}
		view.dispatch(view.state.tr.setSelection(nextSelection).scrollIntoView());
		return true;
	}

	if (event.key === 'ArrowUp' && view.state.selection.$head.parentOffset === 0) {
		const headingPos = pluginState.collapsedHeadingAtSectionEnd.get(currentNodePos);
		if (headingPos !== undefined) {
			return moveToCollapsedHeading(view, headingPos);
		}
	}

	return false;
};
