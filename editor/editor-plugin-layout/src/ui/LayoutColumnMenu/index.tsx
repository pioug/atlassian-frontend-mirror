import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { bind } from 'bind-event-listener';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { DRAG_HANDLE_SELECTOR } from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import {
	ArrowKeyNavigationProvider,
	ArrowKeyNavigationType,
} from '@atlaskit/editor-common/ui-menu';
import { withReactEditorViewOuterListeners } from '@atlaskit/editor-common/ui-react';
import { UserIntentPopupWrapper } from '@atlaskit/editor-common/user-intent';
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

const LAYOUT_COLUMN_MENU_POPUP_OFFSET: [number, number] = [0, 4];
const TOOLBAR_MENU_SELECTOR = '[data-toolbar-component="menu"]';
const NESTED_DROPDOWN_MENU_SELECTOR = '[data-toolbar-nested-dropdown-menu]';

/**
 * Returns the drag handle button for the selected layout column.
 */
const getLayoutColumnMenuTarget = (
	editorView: EditorView,
	selection: Selection | undefined,
	anchorPosFromHandle?: number,
): HTMLElement | null | undefined => {
	const anchorPos = selection && getLayoutColumnMenuAnchorPos(selection, anchorPosFromHandle);
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

const focusTrap = { initialFocus: undefined };

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
		const { isLayoutColumnMenuOpen, layoutColumnMenuAnchorPos, openedViaKeyboard, selection } =
			useSharedPluginStateWithSelector(api, ['layout', 'selection'], (states) => ({
				isLayoutColumnMenuOpen: states.layoutState?.isLayoutColumnMenuOpen ?? false,
				layoutColumnMenuAnchorPos: states.layoutState?.layoutColumnMenuAnchorPos,
				openedViaKeyboard: states.layoutState?.layoutColumnMenuOpenedViaKeyboard ?? false,
				selection: states.selectionState?.selection,
			}));
		const closeLayoutColumnMenu = useCallback(() => {
			api?.core?.actions.execute(api?.layout?.commands.toggleLayoutColumnMenu({ isOpen: false }));
		}, [api]);

		const handleClickOutside = useCallback(
			(event: MouseEvent) => {
				if (
					event.target instanceof Element &&
					(event.target.closest(TOOLBAR_MENU_SELECTOR) ||
						event.target.closest(NESTED_DROPDOWN_MENU_SELECTOR))
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

		const handleArrowKeyNavigationClose = useCallback(
			(event: KeyboardEvent) => {
				event.preventDefault();
				closeLayoutColumnMenu();
			},
			[closeLayoutColumnMenu],
		);

		const shouldDisableArrowKeyNavigation = useCallback((event: KeyboardEvent) => {
			if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
				return false;
			}

			const target = event.target;
			if (!(target instanceof HTMLElement)) {
				return false;
			}

			return target.closest(NESTED_DROPDOWN_MENU_SELECTOR) !== null;
		}, []);

		const menuWrapperRef = useRef<HTMLDivElement>(null);

		const handleMenuKeyDown = useCallback((event: KeyboardEvent) => {
			// Keep menu keyboard events scoped to the menu while preserving Escape and
			// ArrowUp/ArrowDown handling from Popup and ArrowKeyNavigationProvider.
			if (event.key !== 'Escape' && event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
				event.stopPropagation();
			}
		}, []);

		useEffect(() => {
			const menuWrapper = menuWrapperRef.current;
			if (!isLayoutColumnMenuOpen || !menuWrapper) {
				return;
			}

			return bind(menuWrapper, {
				type: 'keydown',
				listener: handleMenuKeyDown,
			});
		}, [handleMenuKeyDown, isLayoutColumnMenuOpen]);

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
				preventOverflow={true}
				stick={true}
				offset={LAYOUT_COLUMN_MENU_POPUP_OFFSET}
				handleClickOutside={handleClickOutside}
				handleEscapeKeydown={closeLayoutColumnMenu}
				focusTrap={openedViaKeyboard ? focusTrap : undefined}
			>
				<div ref={menuWrapperRef}>
					<UserIntentPopupWrapper api={api} userIntent="layoutColumnMenuPopupOpen">
						<ToolbarDropdownMenuProvider
							isOpen={isLayoutColumnMenuOpen}
							setIsOpen={handleSetIsOpen}
						>
							<ArrowKeyNavigationProvider
								type={ArrowKeyNavigationType.MENU}
								handleClose={handleArrowKeyNavigationClose}
								disableArrowKeyNavigation={shouldDisableArrowKeyNavigation}
							>
								<SurfaceRenderer
									components={components}
									fallbacks={LAYOUT_COLUMN_MENU_FALLBACKS}
									surface={LAYOUT_COLUMN_MENU}
								/>
							</ArrowKeyNavigationProvider>
						</ToolbarDropdownMenuProvider>
					</UserIntentPopupWrapper>
				</div>
			</PopupWithListeners>
		);
	},
);
