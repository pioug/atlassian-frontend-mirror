import type { Command, ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { BlockControlsPlugin } from '../types';

export const showDragHandleAtSelection =
	(api?: ExtractInjectionAPI<BlockControlsPlugin>): Command =>
	(state, _, view) => {
		const rootPos = state.selection.$from.before(1);
		const dom = view?.domAtPos(rootPos, 0);
		const rootNode = dom?.node.childNodes[dom?.offset] as HTMLElement | undefined;

		if (rootNode) {
			const anchorName = rootNode.getAttribute('data-drag-handler-anchor-name')!;
			const nodeType = rootNode.getAttribute('data-drag-handler-node-type')!;

			if (api && anchorName && nodeType) {
				api.core.actions.execute(
					api.blockControls.commands.showDragHandleAt(rootPos, anchorName, nodeType, {
						isFocused: true,
					}),
				);
				return true;
			}
		}
		return false;
	};
