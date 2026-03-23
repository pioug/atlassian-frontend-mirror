import React, { useCallback, useEffect, useRef } from 'react';

import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { EditorToolbarProvider, PASTE_MENU } from '@atlaskit/editor-common/toolbar';
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
 * Adjusts the vertical position of the paste menu to align with the top of the
 * pasted content using the exact coordinates at the paste start position,
 * and sticks the menu to the top of the scroll container when the pasted
 * content scrolls above the visible area.
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

	return (position: { bottom?: number; left?: number; right?: number; top?: number }) => {
		const startCoords = editorView.coordsAtPos(pasteStartPos);
		const endBottom = getVisualEndBottom(editorView, pasteEndPos, tableAfterPos);
		const targetRect = targetElement.getBoundingClientRect();

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

		return {
			...position,
			top: adjustedTop,
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

		const legacyVisible =
			isToolbarVisible(editorView.state, lastContentPasted) &&
			(lastContentPasted.text?.length ?? 0) >= 100;

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

	const aiSurfaceComponents = api?.uiControlRegistry?.actions.getComponents('ai-paste-menu') ?? [];
	const visibleAiActionKeys = getVisibleKeys(aiSurfaceComponents, ['button', 'menu-item']);

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

	if (!isToolbarShown) {
		return null;
	}

	if (!anyComponentVisible) {
		return null;
	}

	const target = getTargetElement(editorView, pasteStartPos);
	if (!target) {
		return null;
	}

	return (
		<PopupWithListeners
			target={target}
			mountTo={mountTo}
			boundariesElement={boundariesElement}
			scrollableElement={effectiveScrollableElement}
			minPopupMargin={PASTE_MENU_GAP_HORIZONTAL}
			zIndex={akEditorFloatingPanelZIndex}
			alignX="end"
			alignY="bottom"
			offset={[PASTE_MENU_GAP_HORIZONTAL, 0]}
			onPositionCalculated={onPositionCalculated(
				editorView,
				pasteStartPos,
				pasteEndPos,
				target,
				effectiveScrollableElement,
			)}
			handleClickOutside={handleClickOutside}
			handleEscapeKeydown={handleDismiss}
		>
			<EditorToolbarProvider editorView={editorView}>
				<ToolbarDropdownMenuProvider isOpen={isToolbarShown} setIsOpen={handleSetIsOpen}>
					<PasteActionsMenuContent
						onMouseDown={preventEditorFocusLoss}
						onMouseEnter={handleMouseEnter}
						components={pasteMenuComponents}
					/>
				</ToolbarDropdownMenuProvider>
			</EditorToolbarProvider>
		</PopupWithListeners>
	);
};
