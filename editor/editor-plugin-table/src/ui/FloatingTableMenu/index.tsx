import React, { useCallback, useContext, useMemo, useRef } from 'react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { Popup } from '@atlaskit/editor-common/ui';
import {
	OutsideClickTargetRefContext,
	withReactEditorViewOuterListeners,
} from '@atlaskit/editor-common/ui-react';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorFloatingDialogZIndex,
	akEditorFloatingOverlapPanelZIndex,
} from '@atlaskit/editor-shared-styles';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { ToolbarKeyboardNavigationProvider } from '@atlaskit/editor-toolbar/toolbar-keyboard-navigation-provider';

import { closeActiveTableMenu } from '../../pm-plugins/commands';
import type { RowStickyState } from '../../pm-plugins/sticky-headers/types';
import type { PluginInjectionAPI, TableSharedStateInternal } from '../../types';
import { TableCssClassName as ClassName } from '../../types';
import { dragTableInsertColumnButtonSize, tablePopupMenuFitHeight } from '../consts';
import { COLUMN_MENU } from '../TableMenu/column/keys';
import { ROW_MENU } from '../TableMenu/row/keys';
import { TABLE_MENU_WIDTH } from '../TableMenu/shared/consts';
import { TableMenu } from '../TableMenu/shared/TableMenu';

const PopupWithListeners = withReactEditorViewOuterListeners(Popup);

// Defer drag-handle clicks to the drag handle's own toggle/select handlers — those own
// the open/switch/close semantics for moving between rows/columns.
const DRAG_HANDLE_CONTROLS_SELECTOR = `.${ClassName.DRAG_ROW_CONTROLS}, .${ClassName.DRAG_COLUMN_CONTROLS}`;
const NESTED_DROPDOWN_SELECTOR = '[data-toolbar-nested-dropdown-menu]';

// Marks the menu subtree that ToolbarKeyboardNavigationProvider scopes its
// keyboard handling to. The provider only reacts to events whose target sits
// inside this selector.
const TABLE_MENU_NAV_SELECTOR = '[data-table-drag-menu-nav="true"]';

interface Props {
	api: PluginInjectionAPI | undefined | null;
	boundariesElement?: HTMLElement;
	editorView: EditorView;
	mountPoint?: HTMLElement;
	scrollableElement?: HTMLElement;
	stickyHeaders?: RowStickyState;
	tableWrapper?: HTMLElement;
	targetCellPosition?: number;
}

interface FloatingTableMenuFunction {
	(props: Props): React.JSX.Element | null;
	displayName: string;
}

const TABLE_MENU_OFFSET = dragTableInsertColumnButtonSize + 4;

const POPUP_OFFSET = [TABLE_MENU_OFFSET, 0];

/**
 * Row and column menu for table.
 */
const FloatingTableMenu: FloatingTableMenuFunction = ({
	api,
	boundariesElement,
	editorView,
	mountPoint,
	scrollableElement,
	stickyHeaders,
	tableWrapper,
	targetCellPosition,
}) => {
	const { activeTableMenu } = useSharedPluginStateWithSelector(api, ['table'], (states) => ({
		activeTableMenu: (states.tableState as TableSharedStateInternal | undefined)?.activeTableMenu,
	}));

	const isDragMenuOpen = activeTableMenu?.type === 'row' || activeTableMenu?.type === 'column';
	const dragMenuDirection = isDragMenuOpen ? activeTableMenu.type : undefined;
	const isOpenedByKeyboard = isDragMenuOpen && activeTableMenu.openedBy === 'keyboard';

	const popupContentRef = useRef<HTMLDivElement | null>(null);
	const setOutsideClickTargetRef = useContext(OutsideClickTargetRefContext);
	const navWrapperRef = useRef<HTMLDivElement | null>(null);

	const handlePopupRef = useCallback(
		(el: HTMLDivElement | null) => {
			popupContentRef.current = el;
			setOutsideClickTargetRef?.(el);
		},
		[setOutsideClickTargetRef],
	);

	const returnFocusToDragHandle = useCallback(() => {
		// Match legacy DragMenu's closeMenu('handle') behaviour.
		const handleId =
			dragMenuDirection === 'row' ? '#drag-handle-button-row' : '#drag-handle-button-column';
		const handle = document.querySelector<HTMLElement>(handleId);
		handle?.focus();
	}, [dragMenuDirection]);

	const focusFirstMenuItem = useCallback(() => {
		const root = navWrapperRef.current;
		if (!root) {
			return;
		}
		const firstItem = root.querySelector<HTMLElement>(
			'[role="menuitem"]:not([disabled]), [role="menuitemcheckbox"]:not([disabled]), [role="menuitemradio"]:not([disabled]), button:not([disabled])',
		);
		firstItem?.focus();
	}, []);

	// Focus the first menu item when the menu opens via keyboard (Enter/Space on
	// the drag handle). Mouse-opened menus leave focus where the user clicked.
	const setNavWrapperRef = useCallback(
		(el: HTMLDivElement | null) => {
			navWrapperRef.current = el;
			if (el && isOpenedByKeyboard) {
				// rAF allows the popup to finish positioning before focusing.
				requestAnimationFrame(() => {
					focusFirstMenuItem();
				});
			}
		},
		[focusFirstMenuItem, isOpenedByKeyboard],
	);

	const handleKeyboardFocus = useCallback(
		(_event: KeyboardEvent) => {
			focusFirstMenuItem();
		},
		[focusFirstMenuItem],
	);

	const handleEscape = useCallback(
		(event: KeyboardEvent) => {
			event.preventDefault();
			event.stopPropagation();
			api?.core.actions.execute(closeActiveTableMenu(api));
			returnFocusToDragHandle();
		},
		[api, returnFocusToDragHandle],
	);

	// Memoize the editor DOM reference so the provider doesn't re-bind listeners
	// on every render (the provider depends on `dom` in its effect's deps).
	const editorDom = useMemo(
		() => (editorView.dom instanceof HTMLElement ? editorView.dom : undefined),
		[editorView.dom],
	);

	// The drag menu is opened by interacting with the drag handle directly, not
	// by a global page-level shortcut.
	const isShortcutToFocusToolbar = useCallback(() => false, []);

	const handleClickOutside = useCallback(
		(event: MouseEvent) => {
			const target = event.target;
			// Ignore clicks handled by this popup, drag handles, or nested portalled
			// dropdowns so those controls can manage their own open/close behavior.
			if (
				(target instanceof Node && popupContentRef.current?.contains(target)) ||
				(target instanceof Element &&
					(target.closest(DRAG_HANDLE_CONTROLS_SELECTOR) ||
						target.closest(NESTED_DROPDOWN_SELECTOR)))
			) {
				return;
			}

			// Another table menu (e.g. the cell menu) may have just been opened by this same click.
			// Its React handler runs before this document listener, so the active menu is no longer a
			// row/column menu — don't clobber the newly opened menu back to 'none'.
			const currentActiveTableMenu = (
				api?.table?.sharedState.currentState() as TableSharedStateInternal | undefined
			)?.activeTableMenu;
			if (currentActiveTableMenu?.type !== 'row' && currentActiveTableMenu?.type !== 'column') {
				return;
			}

			api?.core.actions.execute(closeActiveTableMenu(api));
		},
		[api],
	);

	if (
		!isDragMenuOpen ||
		!targetCellPosition ||
		editorView.state.doc.nodeSize <= targetCellPosition
	) {
		return null;
	}

	const inStickyMode =
		stickyHeaders?.sticky ||
		tableWrapper?.classList.contains(ClassName.TABLE_NODE_WRAPPER_NO_OVERFLOW);

	const targetHandleRef =
		dragMenuDirection === 'row'
			? document.querySelector('#drag-handle-button-row')
			: document.querySelector('#drag-handle-button-column');

	if (!targetHandleRef || !(editorView.state.selection instanceof CellSelection)) {
		return null;
	}

	return (
		<PopupWithListeners
			alignX={dragMenuDirection === 'row' ? 'right' : undefined}
			alignY={dragMenuDirection === 'row' ? 'start' : undefined}
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			target={targetHandleRef as HTMLElement}
			mountTo={mountPoint}
			boundariesElement={boundariesElement}
			scrollableElement={scrollableElement}
			fitWidth={TABLE_MENU_WIDTH}
			fitHeight={tablePopupMenuFitHeight}
			// z-index value below is to ensure that this menu is above other floating menu
			// in table, but below floating dialogs like typeaheads, pickers, etc.
			// In sticky mode, we want to show the menu above the sticky header
			zIndex={inStickyMode ? akEditorFloatingDialogZIndex : akEditorFloatingOverlapPanelZIndex}
			forcePlacement={true}
			preventOverflow={dragMenuDirection === 'row'}
			offset={POPUP_OFFSET}
			stick={true}
			handleClickOutside={handleClickOutside}
		>
			<div ref={handlePopupRef}>
				<ToolbarKeyboardNavigationProvider
					childComponentSelector={TABLE_MENU_NAV_SELECTOR}
					dom={editorDom}
					isShortcutToFocusToolbar={isShortcutToFocusToolbar}
					handleFocus={handleKeyboardFocus}
					handleEscape={handleEscape}
				>
					<div data-table-drag-menu-nav="true" ref={setNavWrapperRef}>
						<TableMenu
							api={api}
							editorView={editorView}
							surface={dragMenuDirection === 'row' ? ROW_MENU : COLUMN_MENU}
						/>
					</div>
				</ToolbarKeyboardNavigationProvider>
			</div>
		</PopupWithListeners>
	);
};

FloatingTableMenu.displayName = 'FloatingTableMenu';

export default FloatingTableMenu;
