import React, { useCallback, useEffect, useRef } from 'react';

import { bind } from 'bind-event-listener';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { UserIntentPopupWrapper } from '@atlaskit/editor-common/user-intent';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { setFocusToCellMenu, toggleContextualMenu } from '../../pm-plugins/commands';
import { TableCssClassName as ClassName } from '../../types';
import type { PluginInjectionAPI } from '../../types';
import { CELL_MENU } from '../TableMenu/cell/keys';
import { TableMenu } from '../TableMenu/shared/TableMenu';

type CellMenuPopupProps = {
	api: PluginInjectionAPI | undefined | null;
	editorView: EditorView;
	isCellMenuOpenByKeyboard?: boolean;
	isOpen: boolean;
	targetCellRef: Node;
};

export const CellMenuPopup = ({
	api,
	editorView,
	isCellMenuOpenByKeyboard,
	isOpen,
	targetCellRef,
}: CellMenuPopupProps): React.JSX.Element => {
	const tableMenuRef = useRef<HTMLDivElement | null>(null);
	const { currentUserIntent } = useSharedPluginStateWithSelector(api, ['userIntent'], (states) => ({
		currentUserIntent: states.userIntentState?.currentUserIntent,
	}));

	const closeCellMenu = useCallback(() => {
		const { state, dispatch, dom } = editorView;
		toggleContextualMenu()(state, dispatch);
		if (isCellMenuOpenByKeyboard) {
			setFocusToCellMenu(false)(state, dispatch);
			dom.focus();
		}
	}, [editorView, isCellMenuOpenByKeyboard]);

	useEffect(() => {
		if (!isOpen || currentUserIntent !== 'tableDragMenuPopupOpen') {
			return;
		}

		closeCellMenu();
	}, [closeCellMenu, currentUserIntent, isOpen]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		if (!(targetCellRef instanceof HTMLElement)) {
			return;
		}

		const ownerDocument = targetCellRef.ownerDocument;
		const handlePointerDown = (event: PointerEvent) => {
			const target = event.target;
			if (!(target instanceof Node)) {
				return;
			}
			if (tableMenuRef.current?.contains(target)) {
				return;
			}
			const cellMenuButton = ownerDocument.querySelector(`.${ClassName.CONTEXTUAL_MENU_BUTTON}`);
			if (cellMenuButton?.contains(target)) {
				return;
			}
			closeCellMenu();
		};
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				closeCellMenu();
			}
		};

		const unbindPointerDown = bind(ownerDocument, {
			type: 'pointerdown',
			listener: handlePointerDown,
			options: { capture: true },
		});
		const unbindKeyDown = bind(ownerDocument, {
			type: 'keydown',
			listener: handleKeyDown,
			options: { capture: true },
		});

		return () => {
			unbindPointerDown();
			unbindKeyDown();
		};
	}, [closeCellMenu, isOpen, targetCellRef]);

	return (
		<UserIntentPopupWrapper api={api} userIntent="tableContextualMenuPopupOpen">
			<div ref={tableMenuRef}>
				<TableMenu api={api} editorView={editorView} surface={CELL_MENU} />
			</div>
		</UserIntentPopupWrapper>
	);
};
