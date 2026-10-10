import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { bind } from 'bind-event-listener';

import { surfaceDragHandleElementStore } from '@atlaskit/editor-common/block-controls/surface-drag-handle-element';
import Popup from '@atlaskit/editor-common/Popup';
import { DRAG_HANDLE_SELECTOR } from '@atlaskit/editor-common/styles/drag-handle';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { ArrowKeyNavigationProvider } from '@atlaskit/editor-common/ui-menu/ArrowKeyNavigationProvider';
import { ArrowKeyNavigationType } from '@atlaskit/editor-common/ui-menu/ArrowKeyNavigationProvider/types';
import withReactEditorViewOuterListeners from '@atlaskit/editor-common/ui-react/with-react-editor-view-outer-listeners';
import { UserIntentPopupWrapper } from '@atlaskit/editor-common/UserIntentPopupWrapper';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingOverlapPanelZIndex } from '@atlaskit/editor-shared-styles/constants';
import { ToolbarDropdownMenuProvider } from '@atlaskit/editor-toolbar/toolbar-dropdown-menu-context';
import { SurfaceRenderer } from '@atlaskit/editor-ui-control-model/surface-renderer';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { LayoutPlugin } from '../../layoutPluginType';
import { getLayoutColumnMenuAnchorPos } from '../../pm-plugins/utils/layout-column-selection';
import { LAYOUT_COLUMN_MENU_FALLBACKS } from './components';
import { LAYOUT_COLUMN_MENU } from './keys';

const PopupWithListeners = withReactEditorViewOuterListeners(Popup);

const TOOLBAR_MENU_SELECTOR = '[data-toolbar-component="menu"]';
const NESTED_DROPDOWN_MENU_SELECTOR = '[data-toolbar-nested-dropdown-menu]';
const LAYOUT_COLUMN_MENU_POPUP_OFFSET_BELOW: [number, number] = [0, 2];

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
		const hasValidMenuSelection =
			!isExperimentEnabled('platform_editor_block_control_migration') ||
			(selection !== undefined &&
				getLayoutColumnMenuAnchorPos(selection, layoutColumnMenuAnchorPos) !== undefined);

		const legacyTarget = useMemo(
			() =>
				isLayoutColumnMenuOpen && !isExperimentEnabled('platform_editor_block_control_migration')
					? getLayoutColumnMenuTarget(editorView, selection, layoutColumnMenuAnchorPos)
					: null,
			[editorView, isLayoutColumnMenuOpen, layoutColumnMenuAnchorPos, selection],
		);
		const surfaceTargetRef = useRef<HTMLElement | null>(null);
		const surfaceAnchorPosRef = useRef<number | undefined>(undefined);
		if (
			!isExperimentEnabled('platform_editor_block_control_migration') ||
			!isLayoutColumnMenuOpen
		) {
			surfaceTargetRef.current = null;
			surfaceAnchorPosRef.current = undefined;
		} else if (
			!surfaceTargetRef.current ||
			surfaceAnchorPosRef.current !== layoutColumnMenuAnchorPos
		) {
			surfaceTargetRef.current =
				surfaceDragHandleElementStore.get(editorView) ?? surfaceTargetRef.current;
			surfaceAnchorPosRef.current = layoutColumnMenuAnchorPos;
		}
		const target = isExperimentEnabled('platform_editor_block_control_migration')
			? surfaceTargetRef.current
			: legacyTarget;

		const hasValidTarget = target instanceof HTMLElement;

		useEffect(() => {
			if (
				isLayoutColumnMenuOpen &&
				(!hasValidMenuSelection || !hasValidTarget || components.length === 0)
			) {
				closeLayoutColumnMenu();
			}
		}, [
			closeLayoutColumnMenu,
			components.length,
			hasValidMenuSelection,
			hasValidTarget,
			isLayoutColumnMenuOpen,
		]);

		if (
			!isLayoutColumnMenuOpen ||
			!hasValidMenuSelection ||
			components.length === 0 ||
			!hasValidTarget
		) {
			return null;
		}

		return (
			<PopupWithListeners
				target={target}
				mountTo={mountTo}
				boundariesElement={boundariesElement}
				scrollableElement={scrollableElement}
				zIndex={akEditorFloatingOverlapPanelZIndex}
				forcePlacement={true}
				preventOverflow={true}
				stick={true}
				offset={LAYOUT_COLUMN_MENU_POPUP_OFFSET_BELOW}
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
