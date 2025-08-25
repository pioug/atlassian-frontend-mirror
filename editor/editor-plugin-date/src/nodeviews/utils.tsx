import type { IntlShape } from 'react-intl-next';

import {
	isPastDate,
	timestampToString,
	timestampToTaskContext,
} from '@atlaskit/editor-common/utils';
import type { EditorState } from '@atlaskit/editor-prosemirror/dist/types/state';
import { findParentNodeOfTypeClosestToPos } from '@atlaskit/editor-prosemirror/utils';

type DateInformation = {
	color: 'red' | undefined;
	displayString: string;
};

export const getDateInformation = (
	timestamp: string | number,
	intl: IntlShape,
	state?: EditorState,
	pos?: number,
): DateInformation => {
	if (!state) {
		return { color: undefined, displayString: timestampToString(timestamp, intl) };
	}
	const { doc, selection } = state;
	const { taskItem, blockTaskItem } = state.schema.nodes;

	// We fall back to selection.$from even though it does not cover all use cases
	// eg. upon Editor init, selection is at the start, not at the Date node
	const $nodePos = typeof pos === 'number' ? doc.resolve(pos) : selection.$from;
	const parent = $nodePos.parent;
	let withinIncompleteTask = parent.type === taskItem && parent.attrs.state !== 'DONE';

	// If there is blockTaskItem in the schema and it's not nested in an incomplete task item,
	// check if it's nested in an incomplete block task item
	if (blockTaskItem && !withinIncompleteTask) {
		const blockTaskItemParent = findParentNodeOfTypeClosestToPos($nodePos, blockTaskItem);
		// If nested in a blockTaskItem that is incomplete
		if (blockTaskItemParent) {
			withinIncompleteTask = blockTaskItemParent.node.attrs.state !== 'DONE';
		}
	}
	const color = withinIncompleteTask && isPastDate(timestamp) ? 'red' : undefined;
	const displayString = withinIncompleteTask
		? timestampToTaskContext(timestamp, intl)
		: timestampToString(timestamp, intl);

	return {
		displayString,
		color,
	};
};
