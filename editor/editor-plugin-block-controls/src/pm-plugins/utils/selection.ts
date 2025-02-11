import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { BlockControlsPlugin } from '../../blockControlsPluginType';

export const getMultiSelectionIfPosInside = (
	api: ExtractInjectionAPI<BlockControlsPlugin>,
	pos: number,
): { anchor?: number; head?: number } => {
	const { multiSelectDnD } = api?.blockControls?.sharedState.currentState() || {};
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
