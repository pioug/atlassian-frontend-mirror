import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type Transaction } from '@atlaskit/editor-prosemirror/state';

import type { BlockControlsPlugin } from '../../blockControlsPluginType';
import { key } from '../main';

export const getMultiSelectionIfPosInside = (
	api: ExtractInjectionAPI<BlockControlsPlugin>,
	pos: number,
	tr?: Transaction,
): { anchor?: number; head?: number } => {
	const pluginState = api?.blockControls?.sharedState.currentState();
	// With move nodes shortcut, we expand selection and move node within one transaction,
	// Hence we also look for `multiSelectDnD` in transaction meta
	const multiSelectDnD = pluginState?.multiSelectDnD ?? tr?.getMeta(key)?.multiSelectDnD;

	if (multiSelectDnD && multiSelectDnD.anchor >= 0 && multiSelectDnD.head >= 0) {
		const multiFrom = Math.min(multiSelectDnD.anchor, multiSelectDnD.head);
		const multiTo = Math.max(multiSelectDnD.anchor, multiSelectDnD.head);

		// We subtract one as the handle position is before the node
		return pos >= multiFrom - 1 && pos <= multiTo
			? { anchor: multiSelectDnD.anchor, head: multiSelectDnD.head }
			: {};
	}
	return {};
};

/**
 *
 * @returns from and to positions of the selected content (after expansion)
 */
export const getSelectedSlicePosition = (
	handlePos: number,
	tr: Transaction,
	api: ExtractInjectionAPI<BlockControlsPlugin>,
) => {
	const { anchor, head } = getMultiSelectionIfPosInside(api, handlePos, tr);
	const inSelection = anchor !== undefined && head !== undefined;
	const from = inSelection ? Math.min(anchor, head) : handlePos;

	const activeNode = tr.doc.nodeAt(handlePos);
	const activeNodeEndPos = handlePos + (activeNode?.nodeSize ?? 1);
	const to = inSelection ? Math.max(anchor, head) : activeNodeEndPos;

	return { from, to };
};
