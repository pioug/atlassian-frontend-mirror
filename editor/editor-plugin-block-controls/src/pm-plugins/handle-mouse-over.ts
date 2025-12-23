import memoizeOne from 'memoize-one';

import { areToolbarFlagsEnabled } from '@atlaskit/editor-common/toolbar-flag-check';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { type BlockControlsPlugin } from '../blockControlsPluginType';
import {
	getAnchorAttrName,
	getTypeNameAttrName,
	getTypeNameFromDom,
	NODE_ANCHOR_ATTR_NAME,
} from '../ui/utils/dom-attr-name';

import { IGNORE_NODE_DESCENDANTS_ADVANCED_LAYOUT, IGNORE_NODES_NEXT } from './decorations-anchor';
import { selectionPreservationPluginKey } from './selection-preservation/plugin-key';

const isEmptyNestedParagraphOrHeading = (target: EventTarget | null) => {
	if (target instanceof HTMLHeadingElement || target instanceof HTMLParagraphElement) {
		return !target.parentElement?.classList.contains('ProseMirror') && target.textContent === '';
	}
	return false;
};

const getNodeSelector = (ignoreNodes: string[], ignoreNodeDescendants: string[]) => {
	const baseSelector = `[${NODE_ANCHOR_ATTR_NAME}]`;

	if (ignoreNodes.length === 0 && ignoreNodeDescendants.length === 0) {
		return baseSelector;
	}

	const ignoreNodeSelectorList = ignoreNodes.map(
		(node) => `[data-prosemirror-node-name="${node}"]`,
	);

	const ignoreNodeDescendantsSelectorList = ignoreNodeDescendants.map((node) => {
		if (node === 'table') {
			// Special case for table to exclude its direct descendants
			return [
				`[data-prosemirror-node-name="tableCell"] > [data-node-anchor]`,
				`[data-prosemirror-node-name="tableCell"] > *:not([data-node-anchor]) > [data-node-anchor]`,
				`[data-prosemirror-node-name="tableHeader"] > [data-node-anchor]`,
				`[data-prosemirror-node-name="tableHeader"] > *:not([data-node-anchor]) > [data-node-anchor]`,
			];
		}
		return `[data-prosemirror-node-name="${node}"] [data-node-anchor]`;
	});

	const ignoreSelector = [
		...ignoreNodeSelectorList,
		...ignoreNodeDescendantsSelectorList.flat(),
		'[data-prosemirror-node-inline="true"]',
	].join(', ');

	return `${baseSelector}:not(${ignoreSelector})`;
};

const getDefaultNodeSelector = memoizeOne(() => {
	// we don't show handler for node nested in table
	return getNodeSelector(
		[...IGNORE_NODES_NEXT, 'media'],
		[...IGNORE_NODE_DESCENDANTS_ADVANCED_LAYOUT, 'table'],
	);
});

export const handleMouseOver = (
	view: EditorView,
	event: Event,
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
) => {
	const {
		isDragging,
		activeNode,
		isMenuOpen,
		menuTriggerBy: originalAnchorName,
		blockMenuOptions,
	} = api?.blockControls?.sharedState.currentState() || {};
	const { editorDisabled } = api?.editorDisabled?.sharedState.currentState() || {
		editorDisabled: false,
	};
	const toolbarFlagsEnabled = areToolbarFlagsEnabled(Boolean(api?.toolbar));

	// We shouldn't be firing mouse over transactions when the editor is disabled
	if (editorDisabled && fg('platform_editor_ai_generic_prep_for_aifc')) {
		return false;
	}

	// Most mouseover events don't fire during drag but some can slip through
	// when the drag begins. This prevents those.
	if (isDragging) {
		return false;
	}

	// Ignored via go/ees005
	// eslint-disable-next-line @atlaskit/editor/no-as-casting
	const target = event.target as HTMLElement;
	const isNativeAnchorSupported = expValEquals(
		'platform_editor_native_anchor_with_dnd',
		'isEnabled',
		true,
	);

	if (target?.classList?.contains('ProseMirror')) {
		return false;
	}

	let rootElement = target?.closest(
		isNativeAnchorSupported ? getDefaultNodeSelector() : `[data-drag-handler-anchor-name]`,
	);

	if (rootElement) {
		// We want to exlude handles from showing for empty paragraph and heading nodes
		if (isEmptyNestedParagraphOrHeading(rootElement)) {
			return false;
		}

		if (
			rootElement.getAttribute(getTypeNameAttrName()) === 'media' &&
			editorExperiment('advanced_layouts', true) &&
			!isNativeAnchorSupported
		) {
			rootElement = rootElement.closest(
				`[${getAnchorAttrName()}][${getTypeNameAttrName()}="mediaSingle"]`,
			);

			if (!rootElement) {
				return false;
			}
		}

		const parentElement = rootElement.parentElement?.closest(`[${getAnchorAttrName()}]`);
		const parentElementType = isNativeAnchorSupported
			? getTypeNameFromDom(parentElement)
			: parentElement?.getAttribute('data-drag-handler-node-type');

		if (editorExperiment('advanced_layouts', true)) {
			// We want to exclude handles from showing for direct descendant of table nodes (i.e. nodes in cells)
			if (parentElement && parentElementType === 'table') {
				rootElement = parentElement;
			} else if (parentElement && parentElementType === 'tableRow') {
				const grandparentElement = parentElement?.parentElement?.closest(
					`[${getAnchorAttrName()}]`,
				);
				const grandparentElementType = isNativeAnchorSupported
					? getTypeNameFromDom(grandparentElement)
					: grandparentElement?.getAttribute('data-drag-handler-node-type');

				if (grandparentElement && grandparentElementType === 'table') {
					rootElement = grandparentElement;
				}
			}
		} else {
			// We want to exclude handles from showing for direct descendant of table nodes (i.e. nodes in cells)
			if (parentElement && parentElementType === 'table') {
				rootElement = parentElement;
			}
		}

		let anchorName;
		if (expValEquals('platform_editor_native_anchor_with_dnd', 'isEnabled', true)) {
			anchorName = rootElement.getAttribute(getAnchorAttrName());

			// don't show handles if we can't find an anchor
			if (!anchorName) {
				return false;
			}
		} else {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			anchorName = rootElement.getAttribute(getAnchorAttrName())!;
		}

		// No need to update handle position if its already there
		if (activeNode?.anchorName === anchorName) {
			return false;
		}

		// We want to exlude handles from showing for wrapped nodes
		// TODO: ED-26959 - We should be able remove these check if we decided to
		// go we not decoration for wrapped image solution.
		if (['wrap-right', 'wrap-left'].includes(rootElement.getAttribute('layout') || '')) {
			return false;
		}

		const parentRootElement = rootElement.parentElement;
		let pos: number;

		if (parentRootElement) {
			const childNodes = Array.from(parentRootElement.childNodes);
			const index = childNodes.indexOf(rootElement);
			pos = view.posAtDOM(parentRootElement, index);

			// We want to exlude handles showing for first element in a Panel, ignoring widgets like gapcursor
			const firstChildIsWidget =
				parentRootElement?.children[0]?.classList.contains('ProseMirror-widget');
			if (
				parentElement &&
				parentElementType === 'panel' &&
				!parentElement.classList.contains('ak-editor-panel__no-icon') &&
				(index === 0 || (firstChildIsWidget && index === 1))
			) {
				return false;
			}
		} else {
			pos = view.posAtDOM(rootElement, 0);
		}

		if (
			parentRootElement &&
			parentRootElement.getAttribute('data-layout-section') === 'true' &&
			parentRootElement.querySelectorAll('[data-layout-column]').length === 1 &&
			editorExperiment('advanced_layouts', true)
		) {
			// Don't show drag handle for layout column in a single column layout
			return false;
		}

		const targetPos = view.state.doc.resolve(pos).pos;

		let rootAnchorName;
		let rootNodeType;
		let rootPos;

		// platform_editor_controls note: enables quick insert
		if (toolbarFlagsEnabled) {
			rootPos = view.state.doc.resolve(pos).before(1);
			if (targetPos !== rootPos) {
				const rootDOM = view.nodeDOM(rootPos);
				if (rootDOM instanceof HTMLElement) {
					rootAnchorName = rootDOM.getAttribute(getAnchorAttrName()) ?? undefined;
					rootNodeType = isNativeAnchorSupported
						? getTypeNameFromDom(rootDOM)
						: rootDOM.getAttribute('data-drag-handler-node-type');
				}
			}
		}

		const nodeType = isNativeAnchorSupported
			? getTypeNameFromDom(rootElement)
			: rootElement.getAttribute('data-drag-handler-node-type');

		if (nodeType) {
			// platform_editor_controls note: enables quick insert
			if (toolbarFlagsEnabled) {
				if (expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)) {
					const selection = selectionPreservationPluginKey.getState(view.state)?.preservedSelection;

					const nodeTypes: string[] = [];
					selection?.$from.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
						if (pos < selection.from) {
							// ignore parent node
							return true;
						}
						nodeTypes.push(node.type.name);

						// only care about the top level (relatively in the range) nodes
						return false;
					});
					const isMultipleSelected = nodeTypes.length > 1;

					// Only execute when selection is not a multi-selection, block menu is open, and menu is opened via keyboard
					// as when it is a multi-selection, the showDragHandleAt command interfere with selection
					// sometimes makes the multi-selection not continous after block menu is opened with keyboard
					if (!(isMultipleSelected && isMenuOpen && blockMenuOptions?.openedViaKeyboard)) {
						api?.core?.actions.execute(
							api?.blockControls?.commands.showDragHandleAt(
								targetPos,
								anchorName,
								nodeType,
								undefined,
								rootPos ?? targetPos,
								rootAnchorName ?? anchorName,
								rootNodeType ?? nodeType,
							),
						);
					}
				} else {
					api?.core?.actions.execute(
						api?.blockControls?.commands.showDragHandleAt(
							targetPos,
							anchorName,
							nodeType,
							undefined,
							rootPos ?? targetPos,
							rootAnchorName ?? anchorName,
							rootNodeType ?? nodeType,
						),
					);
				}
			} else {
				api?.core?.actions.execute(
					api?.blockControls?.commands.showDragHandleAt(targetPos, anchorName, nodeType),
				);
			}

			if (expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)) {
				if (
					isMenuOpen &&
					originalAnchorName &&
					api?.userIntent?.sharedState.currentState()?.currentUserIntent === 'blockMenuOpen'
				) {
					api?.core?.actions.execute(api?.blockControls?.commands.toggleBlockMenu());
				}
			}
		}
	}
};
