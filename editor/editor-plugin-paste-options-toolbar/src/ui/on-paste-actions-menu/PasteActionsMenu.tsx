import React, { useCallback, useEffect, useRef } from 'react';

import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import {
	AI_PASTE_MENU_SECTION,
	EditorToolbarProvider,
	PASTE_MENU,
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { findOverflowScrollParent, Popup } from '@atlaskit/editor-common/ui';
import { withReactEditorViewOuterListeners } from '@atlaskit/editor-common/ui-react';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingPanelZIndex } from '@atlaskit/editor-shared-styles';
import { ToolbarDropdownMenuProvider } from '@atlaskit/editor-toolbar';

import { hideToolbar, highlightContent, showToolbar } from '../../editor-commands/commands';
import type {
	PasteOptionsToolbarPlugin,
	PasteOptionsToolbarSharedState,
} from '../../pasteOptionsToolbarPluginType';
import { PASTE_MENU_GAP_HORIZONTAL, PASTE_MENU_GAP_TOP } from '../../pm-plugins/constants';
import { ToolbarDropdownOption } from '../../types/types';
import { isToolbarVisible } from '../toolbar';

import { getVisibleKeys, hasVisibleButton } from './hasVisibleButton';
import { PasteActionsMenuContent } from './PasteActionsMenuContent';

const PopupWithListeners = withReactEditorViewOuterListeners(Popup);

interface PasteActionsMenuProps {
	api: ExtractInjectionAPI<PasteOptionsToolbarPlugin> | undefined;
	boundariesElement?: HTMLElement;
	editorView: EditorView;
	mountTo?: HTMLElement;
	scrollableElement?: HTMLElement;
}

/**
 * Returns the DOM element at the given document position for use as a Popup anchor.
 * For empty blocks (BR elements), returns the parent element to ensure correct positioning.
 */
export function getTargetElement(editorView: EditorView, pos: number): HTMLElement | null {
	try {
		const domRef = findDomRefAtPos(pos, editorView.domAtPos.bind(editorView));
		if (domRef instanceof HTMLElement) {
			// Empty blocks render a <br> placeholder whose bounding rect has no
			// meaningful dimensions (height ≈ 0). Using it as the Popup anchor
			// causes the menu to appear at an unexpected position. Walk up to the
			// parent block element so the Popup anchors correctly.
			if (domRef.nodeName === 'BR' && domRef.parentElement) {
				return domRef.parentElement;
			}
			return domRef;
		}
		return null;
	} catch {
		return null;
	}
}

/**
 * Returns the position immediately after a table ancestor of `pos`, or
 * `undefined` if not inside a table. Safe to cache per document version.
 */
export function resolveTableAfterPos(editorView: EditorView, pos: number): number | undefined {
	const $pos = editorView.state.doc.resolve(pos);
	for (let depth = $pos.depth; depth > 0; depth--) {
		if ($pos.node(depth).type.name === 'table') {
			return $pos.after(depth);
		}
	}
	return undefined;
}

/**
 * Returns the visual bottom of the pasted content. For positions inside a
 * table, uses the pre-computed `tableAfterPos` to get the correct bottom edge.
 */
export function getVisualEndBottom(
	editorView: EditorView,
	pasteEndPos: number,
	tableAfterPos?: number,
): number {
	const endCoords = editorView.coordsAtPos(pasteEndPos);
	let bottom = endCoords.bottom;

	if (tableAfterPos !== undefined) {
		const afterCoords = editorView.coordsAtPos(tableAfterPos);
		bottom = Math.max(bottom, afterCoords.bottom);
	}

	return bottom;
}

/**
 * Finds the DOM element for the nearest block-level ProseMirror ancestor of
 * the given document position. Uses ProseMirror's schema (`node.isBlock`)
 * rather than CSS display properties, so the check is always in sync with the
 * document model.
 *
 * Returns `null` if no block ancestor can be resolved to a DOM element.
 */
export function findBlockAncestorDOM(editorView: EditorView, pos: number): HTMLElement | null {
	try {
		const $pos = editorView.state.doc.resolve(pos);
		// Walk up the document tree from the resolved position's innermost
		// node towards the root. $pos.node(depth) gives the ancestor at each
		// depth; $pos.start(depth) gives the position just inside that ancestor,
		// so `$pos.start(depth) - 1` is the position of the ancestor node itself
		// (which is what nodeDOM expects).
		for (let depth = $pos.depth; depth >= 0; depth--) {
			const node = $pos.node(depth);
			if (node.isBlock) {
				const domNode = editorView.nodeDOM($pos.start(depth) - 1);
				if (domNode instanceof HTMLElement) {
					return domNode;
				}
				// depth 0 is the doc node — nodeDOM(–1) won't work, so try
				// the editor's own DOM element as a fallback.
				if (depth === 0 && editorView.dom instanceof HTMLElement) {
					return editorView.dom;
				}
			}
		}
	} catch {
		// Position may be out of range after a concurrent edit — fall through.
	}
	return null;
}

/**
 * Positions the paste menu inline, immediately to the right of the cursor
 * at the paste end position, vertically centered with the line.
 * Used for short pastes without AI actions.
 */
export function onInlinePositionCalculated(
	editorView: EditorView,
	pasteEndPos: number,
	targetElement: HTMLElement,
	popupContentRef: React.RefObject<HTMLDivElement | null>,
): (position: { bottom?: number; left?: number; right?: number; top?: number }) => {
	bottom?: number;
	left?: number;
	right?: number;
	top: number;
} {
	return (position: { bottom?: number; left?: number; right?: number; top?: number }) => {
		const endCoords = editorView.coordsAtPos(pasteEndPos);
		const targetRect = targetElement.getBoundingClientRect();

		// Vertical: center the menu with the line at the paste end position.
		const lineHeight = endCoords.bottom - endCoords.top;
		const lineMidpoint = endCoords.top + lineHeight / 2;
		const menuHeight = popupContentRef.current?.getBoundingClientRect().height ?? lineHeight;
		const menuTop = lineMidpoint - menuHeight / 2;
		const topDelta = menuTop - (targetRect.top + targetRect.height);
		const adjustedTop = (position.top ?? 0) + topDelta;

		// Horizontal: position to the right of the cursor
		const leftDelta = endCoords.right - targetRect.right;
		const adjustedLeft = (position.left ?? 0) + leftDelta;

		return {
			...position,
			top: adjustedTop,
			left: adjustedLeft,
		};
	};
}

/**
 * Adjusts the position of the paste menu so that:
 *
 * **Vertical:** The menu aligns with the top of the pasted content using the
 * exact coordinates at the paste start position, and sticks to the top of the
 * scroll container when the pasted content scrolls above the visible area.
 *
 * The Popup uses alignY="bottom", which positions the popup below the target
 * element's bottom edge. This override:
 *
 * 1. Shifts the popup from the target's bottom edge to align with the paste
 *    start position.
 * 2. When the paste start scrolls above the scroll container, clamps the menu
 *    to the scroll container's top edge (sticky-top).
 * 3. Stops sticking once the entire pasted range (pasteEndPos) has scrolled
 *    above the visible area.
 *
 * **Horizontal:** When the target element is an inline element (e.g. a mark
 * wrapper like `<strong>`, or an inline node like an emoji), the Popup's
 * `alignX="end"` would place the menu at the right edge of that narrow
 * element. This override resolves the nearest block-level ProseMirror
 * ancestor (using `node.isBlock` from the document schema) and re-anchors
 * the horizontal position to its right edge, so the menu consistently
 * appears at the right side of the content area.
 */
export function onPositionCalculated(
	editorView: EditorView,
	pasteStartPos: number,
	pasteEndPos: number,
	targetElement: HTMLElement,
	scrollableElement?: HTMLElement | false,
): (position: { bottom?: number; left?: number; right?: number; top?: number }) => {
	bottom?: number;
	left?: number;
	right?: number;
	top: number;
} {
	// Pre-compute once per render to avoid doc.resolve() on every scroll frame.
	const tableAfterPos = resolveTableAfterPos(editorView, pasteEndPos);
	const blockAncestorDOM = findBlockAncestorDOM(editorView, pasteStartPos);

	return (position: { bottom?: number; left?: number; right?: number; top?: number }) => {
		const startCoords = editorView.coordsAtPos(pasteStartPos);
		const endBottom = getVisualEndBottom(editorView, pasteEndPos, tableAfterPos);
		const targetRect = targetElement.getBoundingClientRect();

		// ── Vertical adjustment ──────────────────────────────────────────
		// The Popup places the menu at the target's bottom edge by default.
		// We shift it up so it aligns with the paste start position.
		// Both coordinates are in viewport space, so the delta is offset-parent agnostic.
		const topDelta = startCoords.top - (targetRect.top + targetRect.height);
		let adjustedTop = (position.top ?? 0) + topDelta;

		// Sticky-top: clamp to the scroll container's top edge when the paste
		// start has scrolled above the visible area, but only while some pasted
		// content is still visible.
		if (scrollableElement) {
			const scrollContainerTop = scrollableElement.getBoundingClientRect().top;
			if (startCoords.top < scrollContainerTop && endBottom > scrollContainerTop) {
				adjustedTop += scrollContainerTop - startCoords.top + PASTE_MENU_GAP_TOP;
			}
		}

		// ── Horizontal adjustment ────────────────────────────────────────
		// When pasted content starts with a mark (bold, italic, link …) or
		// an inline node (emoji, smart link, inline image …),
		// findDomRefAtPos returns the narrow inline wrapper element. The
		// Popup's alignX="end" then places the menu at that element's right
		// edge instead of the content area's right edge. We correct this by
		// resolving the nearest block-level ProseMirror ancestor and
		// re-anchoring to its right edge.
		let adjustedLeft = position.left;
		if (blockAncestorDOM && blockAncestorDOM !== targetElement) {
			const blockRect = blockAncestorDOM.getBoundingClientRect();
			// Shift left by the difference between the block's right edge and
			// the inline target's right edge. This mirrors what alignX="end"
			// would have computed if the target were the block element.
			const leftDelta = blockRect.right - targetRect.right;
			adjustedLeft = (position.left ?? 0) + leftDelta;
		}

		return {
			...position,
			top: adjustedTop,
			left: adjustedLeft,
		};
	};
}

export const PasteActionsMenu = ({
	api,
	editorView,
	mountTo,
	boundariesElement,
	scrollableElement,
}: PasteActionsMenuProps): React.JSX.Element | null => {
	const editorAnalyticsAPI = api?.analytics?.actions;
	const { lastContentPasted } = useSharedPluginStateWithSelector(api, ['paste'], (states) => ({
		lastContentPasted: states.pasteState?.lastContentPasted,
	}));
	const prevShowToolbarRef = useRef(false);
	const popupContentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!lastContentPasted) {
			hideToolbar()(editorView.state, editorView.dispatch);
			return;
		}

		let selectedOption = ToolbarDropdownOption.None;
		if (!lastContentPasted.isPlainText) {
			selectedOption = ToolbarDropdownOption.RichText;
		} else if (lastContentPasted.isShiftPressed) {
			selectedOption = ToolbarDropdownOption.PlainText;
		} else {
			selectedOption = ToolbarDropdownOption.Markdown;
		}

		const $pos = editorView.state.doc.resolve(lastContentPasted.pasteStartPos);
		const pasteAncestorNodeNames: string[] = [];
		for (let depth = $pos.depth; depth > 0; depth--) {
			// Only include an ancestor if the entire pasted range is contained within it.
			// This prevents nodes like 'heading' from being flagged as ancestors when the
			// pasted content starts in a heading but extends beyond it (e.g. heading + paragraph).
			if (lastContentPasted.pasteEndPos <= $pos.end(depth)) {
				pasteAncestorNodeNames.push($pos.node(depth).type.name);
			}
		}

		const legacyVisible = isToolbarVisible(editorView.state, lastContentPasted);

		showToolbar(
			lastContentPasted,
			selectedOption,
			legacyVisible,
			pasteAncestorNodeNames,
		)(editorView.state, editorView.dispatch);
	}, [lastContentPasted, editorView]);

	const {
		showToolbar: isToolbarShown,
		pasteStartPos,
		pasteEndPos,
	} = useSharedPluginStateWithSelector(api, ['pasteOptionsToolbarPlugin'], (states) => {
		const pluginState = states.pasteOptionsToolbarPluginState as
			| PasteOptionsToolbarSharedState
			| undefined;
		return {
			showToolbar: pluginState?.showToolbar ?? false,
			pasteStartPos: pluginState?.pasteStartPos ?? 0,
			pasteEndPos: pluginState?.pasteEndPos ?? 0,
		};
	});

	const preventEditorFocusLoss = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
	}, []);

	const handleDismiss = useCallback(() => {
		hideToolbar()(editorView.state, editorView.dispatch);
	}, [editorView]);

	const handleMouseEnter = useCallback(() => {
		highlightContent()(editorView.state, editorView.dispatch);
	}, [editorView]);

	const handleClickOutside = useCallback(
		(evt: MouseEvent) => {
			if (evt.target instanceof Element) {
				const isInsideNestedDropdown = evt.target.closest('[data-toolbar-nested-dropdown-menu]');
				if (isInsideNestedDropdown) {
					return;
				}
			}
			handleDismiss();
		},
		[handleDismiss],
	);

	const handleSetIsOpen = useCallback(
		(isOpen: boolean) => {
			if (!isOpen) {
				handleDismiss();
			}
		},
		[handleDismiss],
	);

	// Find the actual scroll container using the same utility the Popup's
	// stick prop uses internally. We pass this as the scrollableElement prop
	// so the Popup attaches its built-in scroll listener, which calls
	// scheduledUpdatePosition (RAF-throttled) on each scroll event — triggering
	// onPositionCalculated with fresh viewport coordinates.
	const overflowScrollParent = isToolbarShown ? findOverflowScrollParent(editorView.dom) : false;
	const effectiveScrollableElement = overflowScrollParent || scrollableElement;

	const pasteMenuComponents = api?.uiControlRegistry?.actions.getComponents(PASTE_MENU.key) ?? [];

	const anyComponentVisible = hasVisibleButton(pasteMenuComponents);

	// eslint-disable-next-line @atlassian/perf-linting/no-expensive-computations-in-render -- pasteMenuComponents changes by reference each render; filter is small (< 10 items)
	const aiMenuItems = pasteMenuComponents.filter(
		(c) => c.type === 'menu-item' && c.parents?.some((p) => p.key === AI_PASTE_MENU_SECTION.key),
	);
	const visibleAiActionKeys = getVisibleKeys(aiMenuItems, ['menu-item']);

	// Two positioning modes:
	// 1. Inline: no AI actions visible — menu appears to the right of the cursor,
	//    vertically centered with the text line.
	// 2. Block-anchored: AI actions are visible — menu appears at the right edge
	//    of the content block, aligned with paste start.
	const hasVisibleAiActions = visibleAiActionKeys.length > 0;

	useEffect(() => {
		if (!prevShowToolbarRef.current && isToolbarShown) {
			editorAnalyticsAPI?.fireAnalyticsEvent({
				action: ACTION.OPENED,
				actionSubject: ACTION_SUBJECT.PASTE_ACTIONS_MENU,
				eventType: EVENT_TYPE.UI,
				attributes: {
					visibleAiActions: visibleAiActionKeys,
				},
			});
		}
		prevShowToolbarRef.current = isToolbarShown;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isToolbarShown, editorAnalyticsAPI]);
	const useInlinePosition = !hasVisibleAiActions;

	if (!isToolbarShown) {
		return null;
	}

	if (!anyComponentVisible) {
		return null;
	}

	const target = getTargetElement(editorView, useInlinePosition ? pasteEndPos : pasteStartPos);
	if (!target) {
		return null;
	}

	// Choose positioning strategy based on whether the menu appears inline
	// (right of cursor for short pastes) or anchored to the block ancestor
	// (right side of content area for longer pastes / AI actions).
	const positionCalculator = useInlinePosition
		? onInlinePositionCalculated(editorView, pasteEndPos, target, popupContentRef)
		: onPositionCalculated(
				editorView,
				pasteStartPos,
				pasteEndPos,
				target,
				effectiveScrollableElement,
			);

	return (
		<PopupWithListeners
			target={target}
			mountTo={mountTo}
			boundariesElement={boundariesElement}
			scrollableElement={effectiveScrollableElement}
			minPopupMargin={PASTE_MENU_GAP_HORIZONTAL}
			zIndex={akEditorFloatingPanelZIndex}
			alignX="end"
			alignY={useInlinePosition ? 'top' : 'bottom'}
			/* eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed) */
			offset={[PASTE_MENU_GAP_HORIZONTAL, 0]}
			onPositionCalculated={positionCalculator}
			handleClickOutside={handleClickOutside}
			handleEscapeKeydown={handleDismiss}
		>
			<EditorToolbarProvider editorView={editorView}>
				<ToolbarDropdownMenuProvider isOpen={isToolbarShown} setIsOpen={handleSetIsOpen}>
					<PasteActionsMenuContent
						onMouseDown={preventEditorFocusLoss}
						onMouseEnter={handleMouseEnter}
						components={pasteMenuComponents}
						contentRef={popupContentRef}
					/>
				</ToolbarDropdownMenuProvider>
			</EditorToolbarProvider>
		</PopupWithListeners>
	);
};
