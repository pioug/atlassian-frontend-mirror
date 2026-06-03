import React, { useCallback, useContext, useRef } from 'react';

import { Popup, type PopupPosition } from '@atlaskit/editor-common/ui';
import {
	OutsideClickTargetRefContext,
	withReactEditorViewOuterListeners,
} from '@atlaskit/editor-common/ui-react';
import { UserIntentPopupWrapper } from '@atlaskit/editor-common/user-intent';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { closeActiveTableMenu, setFocusToCellMenu } from '../../pm-plugins/commands';
import { getPluginState } from '../../pm-plugins/plugin-factory';
import { TableCssClassName as ClassName, type PluginInjectionAPI } from '../../types';
import { tablePopupMenuFitHeight } from '../consts';
import { CELL_MENU } from '../TableMenu/cell/keys';
import { TABLE_MENU_WIDTH } from '../TableMenu/shared/consts';
import { TableMenu } from '../TableMenu/shared/TableMenu';

const PopupWithListeners = withReactEditorViewOuterListeners(Popup);

const NESTED_DROPDOWN_SELECTOR = '[data-toolbar-nested-dropdown-menu]';
const CELL_MENU_TRIGGER_SELECTOR = `.${ClassName.CONTEXTUAL_MENU_BUTTON}`;
const CELL_MENU_TRIGGER_CLEARANCE = [6, 0];

type CellMenuPopupProps = {
	api: PluginInjectionAPI | undefined | null;
	boundariesElement?: HTMLElement;
	editorView: EditorView;
	mountPoint?: HTMLElement;
	scrollableElement?: HTMLElement;
	target: HTMLElement;
	zIndex: number;
};

export const CellMenuPopup = ({
	api,
	boundariesElement,
	editorView,
	mountPoint,
	scrollableElement,
	target,
	zIndex,
}: CellMenuPopupProps): React.JSX.Element => {
	const popupContentRef = useRef<HTMLDivElement | null>(null);
	const setOutsideClickTargetRef = useContext(OutsideClickTargetRefContext);
	const handlePopupRef = useCallback(
		(el: HTMLDivElement | null) => {
			popupContentRef.current = el;
			setOutsideClickTargetRef?.(el);
		},
		[setOutsideClickTargetRef],
	);
	const closeCellMenu = useCallback(() => {
		const { isCellMenuOpenByKeyboard } = getPluginState(editorView.state);
		api?.core.actions.execute(closeActiveTableMenu());

		if (isCellMenuOpenByKeyboard) {
			setFocusToCellMenu(false)(editorView.state, editorView.dispatch);
		}
	}, [api?.core.actions, editorView]);

	const isEventInsideCellMenu = useCallback((event: Event): boolean => {
		const target = event.target;
		if (!(target instanceof Node)) {
			return false;
		}

		if (popupContentRef.current?.contains(target)) {
			return true;
		}

		return (
			target instanceof Element &&
			Boolean(
				target.closest(NESTED_DROPDOWN_SELECTOR) || target.closest(CELL_MENU_TRIGGER_SELECTOR),
			)
		);
	}, []);

	const horizontalPlacementRef = useRef<string | undefined>(undefined);
	const handlePlacementChanged = useCallback(([, horizontalPlacement]: [string, string]) => {
		horizontalPlacementRef.current = horizontalPlacement;
	}, []);

	const handlePositionCalculated = useCallback(
		(position: PopupPosition): PopupPosition => {
			if (horizontalPlacementRef.current !== 'left' || position.left === undefined) {
				return position;
			}

			return {
				...position,
				left: position.left + target.getBoundingClientRect().width,
			};
		},
		[target],
	);
	const handleCellMenuClickOutside = useCallback(
		(event: MouseEvent) => {
			if (isEventInsideCellMenu(event)) {
				return;
			}

			closeCellMenu();
		},
		[closeCellMenu, isEventInsideCellMenu],
	);
	return (
		<PopupWithListeners
			alignX="end"
			alignY="start"
			target={target}
			mountTo={mountPoint}
			boundariesElement={boundariesElement}
			scrollableElement={scrollableElement}
			fitHeight={tablePopupMenuFitHeight}
			fitWidth={TABLE_MENU_WIDTH}
			zIndex={zIndex}
			forcePlacement={true}
			preventOverflow={true}
			onPlacementChanged={handlePlacementChanged}
			onPositionCalculated={handlePositionCalculated}
			offset={CELL_MENU_TRIGGER_CLEARANCE}
			stick={true}
			handleClickOutside={handleCellMenuClickOutside}
			handleEscapeKeydown={closeCellMenu}
		>
			<div ref={handlePopupRef}>
				<UserIntentPopupWrapper api={api} userIntent="tableContextualMenuPopupOpen">
					<TableMenu api={api} editorView={editorView} surface={CELL_MENU} />
				</UserIntentPopupWrapper>
			</div>
		</PopupWithListeners>
	);
};
