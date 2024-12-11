import type { Command, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isInTable } from '@atlaskit/editor-tables/utils';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import { key } from '../pm-plugins/main';
import { getNestedNodePosition } from '../pm-plugins/utils/getNestedNodePosition';

export const showDragHandleAtSelection =
	(api?: ExtractInjectionAPI<BlockControlsPlugin>, shouldFocusParentNode?: boolean): Command =>
	(state, _, view) => {
		const { $from } = state.selection;
		let shouldFocusParentNode;

		if (
			$from.depth > 1 &&
			editorExperiment('nested-dnd', true) &&
			fg('platform_editor_element_dnd_nested_a11y')
		) {
			const { activeNode } = key.getState(state) || {};

			// if the node is already focused, pressing the keymap second times should focus the parent node
			shouldFocusParentNode = activeNode && activeNode.handleOptions?.isFocused;

			const parentPos = isInTable(state)
				? $from.before(1)
				: shouldFocusParentNode
					? $from.before(1)
					: getNestedNodePosition(state) + 1;

			const parentElement = view?.domAtPos(parentPos, 0)?.node as HTMLElement | undefined;
			if (parentElement) {
				let anchorName = parentElement.getAttribute('data-drag-handler-anchor-name')!;
				let nodeType = parentElement.getAttribute('data-drag-handler-node-type')!;

				if (!anchorName || !nodeType) {
					// for nodes like panel and mediaSingle, the drag handle decoration is not applied to the dom node at the node position but to the parent node
					const closestParentElement = parentElement.closest('[data-drag-handler-anchor-name]');
					if (closestParentElement) {
						anchorName = closestParentElement.getAttribute('data-drag-handler-anchor-name')!;
						nodeType = closestParentElement.getAttribute('data-drag-handler-node-type')!;
					}
				}
				if (api && anchorName && nodeType) {
					api.core.actions.execute(
						api.blockControls.commands.showDragHandleAt(parentPos - 1, anchorName, nodeType, {
							isFocused: true,
						}),
					);

					return true;
				}
			}
		}

		const rootPos = $from.before(1);
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
