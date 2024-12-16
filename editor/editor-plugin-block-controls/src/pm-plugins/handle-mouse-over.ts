import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { type BlockControlsPlugin } from '../blockControlsPluginType';

const isEmptyNestedParagraphOrHeading = (target: EventTarget | null) => {
	if (target instanceof HTMLHeadingElement || target instanceof HTMLParagraphElement) {
		return !target.parentElement?.classList.contains('ProseMirror') && target.textContent === '';
	}
	return false;
};

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

	if (target?.classList?.contains('ProseMirror')) {
		return false;
	}

	let rootElement = target?.closest('[data-drag-handler-anchor-name]');
	if (rootElement) {
		// We want to exlude handles from showing for empty paragraph and heading nodes
		if (editorExperiment('nested-dnd', true) && isEmptyNestedParagraphOrHeading(rootElement)) {
			return false;
		}

		if (
			rootElement.getAttribute('data-drag-handler-node-type') === 'media' &&
			editorExperiment('advanced_layouts', true)
		) {
			rootElement = rootElement.closest(
				'[data-drag-handler-anchor-name][data-drag-handler-node-type="mediaSingle"]',
			);

			if (!rootElement) {
				return false;
			}
		}

		const parentElement = rootElement.parentElement?.closest('[data-drag-handler-anchor-name]');
		const parentElementType = parentElement?.getAttribute('data-drag-handler-node-type');

		if (
			editorExperiment('advanced_layouts', true) &&
			fg('platform_editor_advanced_layouts_post_fix_patch_1')
		) {
			// We want to exclude handles from showing for direct descendant of table nodes (i.e. nodes in cells)
			if (
				parentElement &&
				(parentElementType === 'table' || parentElementType === 'tableRow') &&
				editorExperiment('nested-dnd', true) &&
				editorExperiment('table-nested-dnd', false, { exposure: true })
			) {
				rootElement = parentElement;
			}
		} else {
			// We want to exclude handles from showing for direct descendant of table nodes (i.e. nodes in cells)
			if (
				parentElement &&
				parentElementType === 'table' &&
				editorExperiment('nested-dnd', true) &&
				editorExperiment('table-nested-dnd', false, { exposure: true })
			) {
				rootElement = parentElement;
			}
		}

		const anchorName = rootElement.getAttribute('data-drag-handler-anchor-name')!;
		// No need to update handle position if its already there
		if (activeNode?.anchorName === anchorName) {
			return false;
		}

		// We want to exlude handles from showing for wrapped nodes
		// TODO We should be able remove these check if we decided to
		// go we not decoration for wrapped image solution.
		if (
			['wrap-right', 'wrap-left'].includes(rootElement.getAttribute('layout') || '') &&
			fg('platform_editor_element_drag_and_drop_ed_24227')
		) {
			return false;
		}

		const parentRootElement = rootElement.parentElement;
		let pos: number;
		if (parentRootElement && editorExperiment('nested-dnd', true)) {
			const childNodes = Array.from(parentRootElement.childNodes);
			const index = childNodes.indexOf(rootElement);
			pos = view.posAtDOM(parentRootElement, index);

			// We want to exlude handles showing for first element in a Panel, ignoring widgets like gapcursor
			const firstChildIsWidget =
				parentRootElement?.children[0]?.classList.contains('ProseMirror-widget');
			if (
				parentElement &&
				parentElementType === 'panel' &&
				(fg('platform_editor_element_dnd_nested_fix_patch_1')
					? !parentElement.classList.contains('ak-editor-panel__no-icon')
					: true) &&
				(index === 0 || (firstChildIsWidget && index === 1))
			) {
				return false;
			}
		} else {
			pos = view.posAtDOM(rootElement, 0);
		}

		let rootPos: number;
		if (editorExperiment('nested-dnd', true)) {
			rootPos = view.state.doc.resolve(pos).pos;
		} else {
			rootPos = view.state.doc.resolve(pos).start(1) - 1;
		}

		const nodeType = rootElement.getAttribute('data-drag-handler-node-type');
		if (nodeType) {
			api?.core?.actions.execute(
				api?.blockControls?.commands.showDragHandleAt(rootPos, anchorName, nodeType),
			);
		}
	}
};
