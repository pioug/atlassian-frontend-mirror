import type { Selection, Transaction } from '@atlaskit/editor-prosemirror/state';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';

import { blockCollapsePluginKey } from './plugin-key';
import { getBlockCollapseSection } from './section-model';
import type { ToggleAction } from './types';

const selectionIntersectsSection = (
	selection: Selection,
	section: { from: number; to: number },
): boolean =>
	selection.empty
		? selection.from >= section.from && selection.from < section.to
		: selection.from < section.to && selection.to > section.from;

export const moveSelectionToHeading = (tr: Transaction, headingPos: number): void => {
	const headingNode = tr.doc.nodeAt(headingPos);
	if (!headingNode) {
		return;
	}

	tr.setSelection(TextSelection.near(tr.doc.resolve(headingPos + headingNode.nodeSize - 1), -1));
};

export const toggleHeadingInTransaction = (
	tr: Transaction,
	headingPos: number,
): Transaction | null => {
	const section = getBlockCollapseSection(tr.doc, headingPos);
	if (!section) {
		return null;
	}

	if (selectionIntersectsSection(tr.selection, section)) {
		moveSelectionToHeading(tr, headingPos);
	}

	return tr.setMeta(blockCollapsePluginKey, {
		headingPos,
		type: 'toggle',
	} satisfies ToggleAction);
};
