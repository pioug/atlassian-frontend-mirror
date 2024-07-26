import type { Command, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { fg } from '@atlaskit/platform-feature-flags';

import type { BlockControlsPlugin } from '../types';

export const showDragHandleAtSelection =
	(api?: ExtractInjectionAPI<BlockControlsPlugin>): Command =>
	(state, _, view) => {
		const rootPos = state.selection.$from.before(1);
		const dom = view?.domAtPos(rootPos, 0);
		const nodeElement = dom?.node.childNodes[dom?.offset] as HTMLElement | undefined;

		const rootNode =
			nodeElement &&
			!nodeElement.hasAttribute('data-drag-handler-anchor-name') &&
			fg('platform_editor_element_drag_and_drop_ed_24321')
				? nodeElement.querySelector('[data-drag-handler-anchor-name]')
				: nodeElement;

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
