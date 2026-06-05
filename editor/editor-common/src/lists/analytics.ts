import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import type { CommonListAnalyticsAttributes } from '../analytics';

import { countListItemsInSelection } from './countListItemsInSelection';
import { getListItemAttributes } from './selection';

export const getCommonListAnalyticsAttributes = (
	tr: Transaction,
): CommonListAnalyticsAttributes => {
	const {
		selection: { $from, $to },
	} = tr;
	const fromAttrs = getListItemAttributes($from);
	const toAttrs = getListItemAttributes($to);

	return {
		itemIndexAtSelectionStart: fromAttrs.itemIndex,
		itemIndexAtSelectionEnd: toAttrs.itemIndex,
		indentLevelAtSelectionStart: fromAttrs.indentLevel,
		indentLevelAtSelectionEnd: toAttrs.indentLevel,
		itemsInSelection: countListItemsInSelection(tr),
	};
};
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { countListItemsInSelection } from './countListItemsInSelection';
