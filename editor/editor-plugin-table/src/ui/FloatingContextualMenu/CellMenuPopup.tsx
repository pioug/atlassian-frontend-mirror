import React, { useCallback, useContext, useRef } from 'react';

import { Popup } from '@atlaskit/editor-common/ui';
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

type CellMenuPopupProps = {
	api: PluginInjectionAPI | undefined | null;
	boundariesElement?: HTMLElement;
	editorView: EditorView;
	mountPoint?: HTMLElement;
	scrollableElement?: HTMLElement;
	targetCellRef: HTMLElement;
	zIndex: number;
};

export const CellMenuPopup = ({
	api,
	boundariesElement,
	editorView,
	mountPoint,
	scrollableElement,
	targetCellRef,
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
		closeActiveTableMenu()(editorView.state, editorView.dispatch);

		if (isCellMenuOpenByKeyboard) {
			setFocusToCellMenu(false)(editorView.state, editorView.dispatch);
		}
	}, [editorView]);

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
			alignX="right"
			alignY="top"
			target={targetCellRef}
			mountTo={mountPoint}
			boundariesElement={boundariesElement}
			scrollableElement={scrollableElement}
			fitHeight={tablePopupMenuFitHeight}
			fitWidth={TABLE_MENU_WIDTH}
			zIndex={zIndex}
			forcePlacement={true}
			// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
			offset={[-7, 0]}
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
