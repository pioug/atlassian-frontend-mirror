import type { IntlShape } from 'react-intl-next';

import {
	isPastDate,
	timestampToString,
	timestampToTaskContext,
} from '@atlaskit/editor-common/utils';
import type { EditorState } from '@atlaskit/editor-prosemirror/dist/types/state';

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
	const { taskItem } = state.schema.nodes;

	// We fall back to selection.$from even though it does not cover all use cases
	// eg. upon Editor init, selection is at the start, not at the Date node
	const $nodePos = typeof pos === 'number' ? doc.resolve(pos) : selection.$from;
	const parent = $nodePos.parent;
	const withinIncompleteTask = parent.type === taskItem && parent.attrs.state !== 'DONE';

	const color = withinIncompleteTask && isPastDate(timestamp) ? 'red' : undefined;
	const displayString = withinIncompleteTask
		? timestampToTaskContext(timestamp, intl)
		: timestampToString(timestamp, intl);

	return {
		displayString,
		color,
	};
};
