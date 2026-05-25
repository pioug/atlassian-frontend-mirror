import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef } from 'react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { DRAG_HANDLE_SELECTOR } from '@atlaskit/editor-common/styles';
import { EditorToolbarProvider } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import {
	OutsideClickTargetRefContext,
	withReactEditorViewOuterListeners,
} from '@atlaskit/editor-common/ui-react';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingOverlapPanelZIndex } from '@atlaskit/editor-shared-styles';
import { ToolbarDropdownMenuProvider } from '@atlaskit/editor-toolbar';
import { SurfaceRenderer } from '@atlaskit/editor-ui-control-model';

import type { LayoutPlugin } from '../../layoutPluginType';
import { getLayoutColumnMenuAnchorPos } from '../../pm-plugins/utils/layout-column-selection';

import { LAYOUT_COLUMN_MENU_FALLBACKS } from './components';
import { LAYOUT_COLUMN_MENU } from './keys';

const PopupWithListeners = withReactEditorViewOuterListeners(Popup);

const FALLBACK_MENU_HEIGHT = 300;
const LAYOUT_COLUMN_MENU_POPUP_OFFSET: [number, number] = [0, 4];

/**
 * Returns the drag handle button for the selected layout column.
 */
const getLayoutColumnMenuTarget = (
	editorView: EditorView,
	selection: Selection | undefined,
	anchorPosFromHandle?: number,
): HTMLElement | null | undefined => {
	const anchorPos = getLayoutColumnMenuAnchorPos(selection, anchorPosFromHandle);
	if (anchorPos === undefined) {
		return null;
	}
	const columnDomRef = editorView.nodeDOM(anchorPos);
	if (!(columnDomRef instanceof HTMLElement)) {
		return null;
	}
	const dragHandleContainer = columnDomRef.parentElement?.querySelector<HTMLElement>(
		':scope > [data-blocks-drag-handle-container]',
	);
	return dragHandleContainer?.querySelector<HTMLElement>(DRAG_HANDLE_SELECTOR);
};

type LayoutColumnMenuProps = {
	api: ExtractInjectionAPI<LayoutPlugin> | undefined;
	boundariesElement?: HTMLElement;
	editorView: EditorView;
	mountTo?: HTMLElement;
	scrollableElement?: HTMLElement;
};

export const LayoutColumnMenu: React.NamedExoticComponent<LayoutColumnMenuProps> = React.memo(
	function LayoutColumnMenu({
		api,
		editorView,
		mountTo,
		boundariesElement,
		scrollableElement,
	}: LayoutColumnMenuProps): React.JSX.Element | null {
		const { isLayoutColumnMenuOpen, layoutColumnMenuAnchorPos, selection } =
			useSharedPluginStateWithSelector(api, ['layout', 'selection'], (states) => ({
				isLayoutColumnMenuOpen: states.layoutState?.isLayoutColumnMenuOpen ?? false,
				layoutColumnMenuAnchorPos: states.layoutState?.layoutColumnMenuAnchorPos,
				selection: states.selectionState?.selection,
			}));
		const setOutsideClickTargetRef = useContext(OutsideClickTargetRefContext);
		const menuRef = useRef<HTMLDivElement | null>(null);
		const popupRef = useRef<HTMLElement | undefined>(undefined);
		const [menuHeight, setMenuHeight] = React.useState<number>(FALLBACK_MENU_HEIGHT);

		useLayoutEffect(() => {
			if (!isLayoutColumnMenuOpen) {
				return;
			}
			setMenuHeight(popupRef.current?.clientHeight || FALLBACK_MENU_HEIGHT);
		}, [isLayoutColumnMenuOpen]);

		const closeLayoutColumnMenu = useCallback(() => {
			api?.core?.actions.execute(api?.layout?.commands.toggleLayoutColumnMenu({ isOpen: false }));
		}, [api]);

		const handleClickOutside = useCallback(
			(event: MouseEvent) => {
				if (event.target instanceof Node && menuRef.current?.contains(event.target)) {
					return;
				}

				if (
					event.target instanceof Element &&
					event.target.closest('[data-toolbar-nested-dropdown-menu]')
				) {
					return;
				}

				// Clicking a drag handle should let the drag handle's own click handler
				// update selection/menu state. Treating it as a generic outside click
				// races that transaction and can immediately close the layout column menu.
				if (event.target instanceof Element && event.target.closest(DRAG_HANDLE_SELECTOR)) {
					return;
				}

				closeLayoutColumnMenu();
			},
			[closeLayoutColumnMenu],
		);

		const handleSetIsOpen = useCallback(
			(isOpen: boolean) => {
				if (!isOpen) {
					closeLayoutColumnMenu();
				}
			},
			[closeLayoutColumnMenu],
		);

		const handleMenuRef = useCallback(
			(el: HTMLDivElement | null) => {
				setOutsideClickTargetRef?.(el);
				menuRef.current = el;
				if (el) {
					popupRef.current = el;
				}
			},
			[setOutsideClickTargetRef],
		);

		const components = api?.uiControlRegistry?.actions.getComponents(LAYOUT_COLUMN_MENU.key) ?? [];

		const target = useMemo(
			() =>
				isLayoutColumnMenuOpen
					? getLayoutColumnMenuTarget(editorView, selection, layoutColumnMenuAnchorPos)
					: null,
			[editorView, isLayoutColumnMenuOpen, layoutColumnMenuAnchorPos, selection],
		);

		const hasValidTarget = target instanceof HTMLElement;

		useEffect(() => {
			if (isLayoutColumnMenuOpen && (!hasValidTarget || components.length === 0)) {
				closeLayoutColumnMenu();
			}
		}, [closeLayoutColumnMenu, components.length, hasValidTarget, isLayoutColumnMenuOpen]);

		if (!isLayoutColumnMenuOpen || components.length === 0 || !hasValidTarget) {
			return null;
		}

		return (
			<PopupWithListeners
				target={target}
				mountTo={mountTo}
				boundariesElement={boundariesElement}
				scrollableElement={scrollableElement}
				zIndex={akEditorFloatingOverlapPanelZIndex}
				alignX="center"
				fitHeight={menuHeight}
				preventOverflow={true}
				stick={true}
				offset={LAYOUT_COLUMN_MENU_POPUP_OFFSET}
				handleClickOutside={handleClickOutside}
				handleEscapeKeydown={closeLayoutColumnMenu}
			>
				<div ref={handleMenuRef}>
					<EditorToolbarProvider editorView={editorView}>
						<ToolbarDropdownMenuProvider
							isOpen={isLayoutColumnMenuOpen}
							setIsOpen={handleSetIsOpen}
						>
							<SurfaceRenderer
								components={components}
								fallbacks={LAYOUT_COLUMN_MENU_FALLBACKS}
								surface={LAYOUT_COLUMN_MENU}
							/>
						</ToolbarDropdownMenuProvider>
					</EditorToolbarProvider>
				</div>
			</PopupWithListeners>
		);
	},
);
