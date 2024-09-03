import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { type BlockControlsPlugin } from '../types';

export const handleMouseOver = (
	view: EditorView,
	event: Event,
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
) => {
	const { isDragging, activeNode } = api?.blockControls?.sharedState.currentState() || {};
	// Most mouseover events don't fire during drag but some can slip through
	// when the drag begins. This prevents those.
	if (isDragging) {
		return false;
	}
	const target = event.target as HTMLElement;
	if (target.classList.contains('ProseMirror')) {
		return false;
	}
	let rootElement = target?.closest('[data-drag-handler-anchor-name]');
	if (rootElement) {
		const tableElement = rootElement.closest('[data-drag-handler-node-type="table"]');

		if (
			tableElement &&
			editorExperiment('nested-dnd', true) &&
			editorExperiment('table-nested-dnd', false, { exposure: true })
		) {
			rootElement = tableElement;
		}
		const anchorName = rootElement.getAttribute('data-drag-handler-anchor-name')!;
		const nodeType = rootElement.getAttribute('data-drag-handler-node-type')!;

		if (activeNode?.anchorName === anchorName) {
			return false;
		}

		if (
			['wrap-right', 'wrap-left'].includes(rootElement.getAttribute('layout') || '') &&
			fg('platform_editor_element_drag_and_drop_ed_24227')
		) {
			return false;
		}

		const pos = view.posAtDOM(rootElement, 0, -1);

		let rootPos;
		if (editorExperiment('nested-dnd', true, { exposure: true })) {
			const $rootPos = view.state.doc.resolve(pos);

			const depth = $rootPos.depth;
			const isParentAnIsolatingNode =
				$rootPos.parent?.type.name !== 'doc' && $rootPos.parent?.type.spec.isolating;
			const isCurrentNodeAtom = $rootPos.nodeAfter?.isAtom;

			/**
			 * If the parent node is an isolating node, the sides of nodes of this type are considered boundaries, such as a table cell.
			 * And the current node, as a direct child, is an atom node, meaning it does not have directly editable content.
			 * e.g. a card or an extension
			 * We maintain the original position by adding 1 to the depth.
			 * This prevents the decoration from being inserted in the wrong position, like between table cells.
			 */
			const posDepth = isParentAnIsolatingNode && isCurrentNodeAtom ? depth + 1 : depth;

			rootPos = depth ? $rootPos.before(posDepth) : $rootPos.pos;
		} else {
			rootPos = view.state.doc.resolve(pos).start(1) - 1;
		}

		if (nodeType) {
			api?.core?.actions.execute(
				api?.blockControls?.commands.showDragHandleAt(rootPos, anchorName, nodeType),
			);
		}
	}
};
