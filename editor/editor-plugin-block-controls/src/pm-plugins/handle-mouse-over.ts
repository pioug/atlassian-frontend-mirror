import memoizeOne from 'memoize-one';

import { isMultiBlockSelection } from '@atlaskit/editor-common/selection';
import { areToolbarFlagsEnabled } from '@atlaskit/editor-common/toolbar-flag-check';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
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

// Block marks (e.g. font-size) wrap paragraphs in an extra div, making parentRootElement
// the mark wrapper instead of the panel content container. When that happens, recalculate
// the index relative to the panel content so the first-child check stays accurate.
const getBlockMarkPanelIndexAdjustment = (parentRootElement: HTMLElement, index: number) => {
	if (
		expValEquals('platform_editor_small_font_size', 'isEnabled', true) &&
		parentRootElement.classList.contains('fabric-editor-block-mark') &&
		parentRootElement.parentElement
	) {
		return Array.from(parentRootElement.parentElement.childNodes).indexOf(parentRootElement);
	}

	return index;
};

/**
 * If the hovered element is a paragraph adjacent to a wrapped mediaSingle/embedCard,
 * redirect to the media node so only one drag handle shows (ED-26959).
 */
const redirectParagraphToWrappedMedia = (
	rootElement: Element,
	isNativeAnchorSupported: boolean,
): Element => {
	const hoveredNodeType = isNativeAnchorSupported
		? getTypeNameFromDom(rootElement)
		: rootElement.getAttribute('data-drag-handler-node-type');

	if (hoveredNodeType !== 'paragraph') {
		return rootElement;
	}

	const isWrappedMediaEmbedSibling = (sibling: Element | null): boolean => {
		if (!sibling || !sibling.getAttribute(getAnchorAttrName())) {
			return false;
		}
		const siblingType = isNativeAnchorSupported
			? getTypeNameFromDom(sibling)
			: sibling.getAttribute('data-drag-handler-node-type');
		const siblingLayout = sibling.getAttribute('layout') || '';
		return (
			(siblingType === 'mediaSingle' || siblingType === 'embedCard') &&
			['wrap-left', 'wrap-right'].includes(siblingLayout)
		);
	};

	const prevSibling = rootElement.previousElementSibling;
	const nextSibling = rootElement.nextElementSibling;
	if (prevSibling && isWrappedMediaEmbedSibling(prevSibling)) {
		return prevSibling;
	} else if (nextSibling && isWrappedMediaEmbedSibling(nextSibling)) {
		return nextSibling;
	}

	return rootElement;
};

export const handleMouseOver = (
	view: EditorView,
	event: Event,
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
): false | undefined => {
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
	const editorViewMode = api?.editorViewMode?.sharedState.currentState()?.mode;
	const isViewMode = editorViewMode === 'view';
	const toolbarFlagsEnabled = areToolbarFlagsEnabled(Boolean(api?.toolbar));

	// We shouldn't be firing mouse over transactions when the editor is disabled,
	// except in view mode when right-side controls are enabled (show controls on block hover)
	const rightSideControlsEnabled =
		api?.blockControls?.sharedState.currentState()?.rightSideControlsEnabled ?? false;
	if (
		editorDisabled &&
		(!isViewMode ||
			!(rightSideControlsEnabled && fg('confluence_remix_button_right_side_block_fg')))
	) {
		return false;
	}

	// If the editor view is not in focus when the block menu is open, do not update the drag handle
	if (
		!view.hasFocus() &&
		isMenuOpen &&
		editorExperiment('platform_editor_block_menu', true, { exposure: true })
	) {
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

	// Fallback for table nodes in view mode: the table-anchor-names plugin sets data-node-anchor on
	// the first <tr> element.
	// - When platform_editor_native_anchor_with_dnd is disabled, the primary closest() uses
	//   [data-drag-handler-anchor-name] and misses table rows. Try data-node-anchor via closest().
	// - For wide/max breakout tables, hovering in the left/right margin area of the full-viewport-
	//   width breakout wrapper (ak-editor-breakout-mark) sets event.target to the wrapper div, which
	//   has no anchor attribute. Use querySelector to find the [data-node-anchor] descendant inside.
	// Both cases apply only in view mode with right-side remix controls.
	if (!rootElement && isViewMode && rightSideControlsEnabled) {
		rootElement =
			target?.closest(`[${NODE_ANCHOR_ATTR_NAME}]`) ??
			(target instanceof HTMLElement
				? (target.querySelector(`[${NODE_ANCHOR_ATTR_NAME}]`) as HTMLElement | null)
				: null) ??
			null;
	}

	// When hovering over the right-edge button (rendered in a portal outside the block), resolve the
	// block from the container's anchor so activeNode stays set and the button remains visible.
	if (
		!rootElement &&
		rightSideControlsEnabled &&
		fg('confluence_remix_button_right_side_block_fg')
	) {
		const rightEdgeContainer = target?.closest('[data-blocks-right-edge-button-container]');
		if (rightEdgeContainer) {
			const anchor = rightEdgeContainer.getAttribute('data-blocks-right-edge-button-anchor');
			if (anchor) {
				rootElement = view.dom.querySelector(
					`[${getAnchorAttrName()}="${CSS.escape(anchor)}"]`,
				) as HTMLElement | null;
			}
		}
	}

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

		// A wrapped mediaSingle/embedCard and the paragraph(s) it floats next to both have
		// anchor decorations. If the hovered rootElement is a paragraph whose adjacent DOM sibling
		// is a wrapped mediaSingle/embedCard with an anchor, redirect the handle to the media node
		// so only one handle shows (ED-26959).
		// We check previousElementSibling (wrap-left: media precedes text in DOM) and
		// nextElementSibling (wrap-right: media follows text in DOM).
		// This must happen before anchorName is read so the correct node's handle is shown.
		rootElement = redirectParagraphToWrappedMedia(rootElement, isNativeAnchorSupported);

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
			// Fallback for table nodes that only have data-node-anchor (not data-drag-handler-anchor-name).
			if (!anchorName) {
				anchorName = rootElement.getAttribute(NODE_ANCHOR_ATTR_NAME) ?? anchorName;
			}
		}

		// No need to update handle position if its already there
		if (activeNode?.anchorName === anchorName) {
			return false;
		}

		const parentRootElement = rootElement.parentElement;
		let pos: number;

		if (parentRootElement) {
			const childNodes = Array.from(parentRootElement.childNodes);
			const index = childNodes.indexOf(rootElement);
			pos = view.posAtDOM(parentRootElement, index);

			const panelIndex = getBlockMarkPanelIndexAdjustment(parentRootElement, index);
			// We want to exlude handles showing for first element in a Panel, ignoring widgets like gapcursor
			const firstChildIsWidget =
				parentRootElement?.children[0]?.classList.contains('ProseMirror-widget');
			if (
				parentElement &&
				parentElementType === 'panel' &&
				!parentElement.classList.contains('ak-editor-panel__no-icon') &&
				(panelIndex === 0 || (firstChildIsWidget && panelIndex === 1))
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
			editorExperiment('advanced_layouts', true) &&
			!expValEquals('platform_editor_layout_column_menu', 'isEnabled', true)
		) {
			// Don't show drag handle for layout column in a single column layout,
			// unless the layout column menu is enabled (menu needs the handle to be accessible).
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
					rootAnchorName =
						rootDOM.getAttribute(getAnchorAttrName()) ??
						rootDOM.getAttribute(NODE_ANCHOR_ATTR_NAME) ??
						undefined;
					rootNodeType = isNativeAnchorSupported
						? getTypeNameFromDom(rootDOM)
						: // Fallback: breakout mark wrappers have no data-drag-handler-node-type;
							// use data-prosemirror-node-name instead.
							(rootDOM.getAttribute('data-drag-handler-node-type') ?? getTypeNameFromDom(rootDOM));
				}
			}
		}

		const nodeType = isNativeAnchorSupported
			? getTypeNameFromDom(rootElement)
			: // Fallback for table nodes: tr has data-prosemirror-node-name but not data-drag-handler-node-type.
				(rootElement.getAttribute('data-drag-handler-node-type') ??
				getTypeNameFromDom(rootElement));

		if (nodeType) {
			// platform_editor_controls note: enables quick insert
			if (toolbarFlagsEnabled) {
				if (editorExperiment('platform_editor_block_menu', true)) {
					const preservedSelection = selectionPreservationPluginKey.getState(
						view.state,
					)?.preservedSelection;
					const selection = preservedSelection || view.state.selection;
					const isMultipleSelected = selection && isMultiBlockSelection(selection);

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

			if (editorExperiment('platform_editor_block_menu', true)) {
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
