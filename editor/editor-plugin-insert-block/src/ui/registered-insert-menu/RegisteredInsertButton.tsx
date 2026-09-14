import React, { useCallback, useRef, useState } from 'react';

import { useIntl } from 'react-intl';

import {
	getAriaKeyshortcuts,
	insertElements,
	ToolTipContent,
} from '@atlaskit/editor-common/keymaps';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { TOOLBAR_BUTTON_TEST_ID, useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import { isOfflineMode } from '@atlaskit/editor-plugin-connectivity/connectivityPluginType';
import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles/constants';
import { AddIcon } from '@atlaskit/editor-toolbar/add-icon';
import { ToolbarButton } from '@atlaskit/editor-toolbar/toolbar-button';
import { ToolbarTooltip } from '@atlaskit/editor-toolbar/toolbar-tooltip';
import { useToolbarUI } from '@atlaskit/editor-toolbar/ui-context';

import type { InsertBlockPlugin } from '../../insertBlockPluginType';

import { RegisteredInsertMenuContent } from './RegisteredInsertMenuContent';

const DEFAULT_MENU_MAX_HEIGHT = 520;
const FIT_HEIGHT_BUFFER = 100;
const POPUP_OFFSET: [number, number] = [0, 3];

type Props = {
	api?: ExtractInjectionAPI<InsertBlockPlugin>;
};

/**
 * The toolbar owns its popup lifecycle, but renders the same registered items
 * and menu model as slash command.
 */
export const RegisteredInsertButton = ({ api }: Props): React.JSX.Element | null => {
	const { editorView } = useEditorToolbar();
	const { formatMessage } = useIntl();
	const { isDisabled, popupsBoundariesElement, popupsMountPoint, popupsScrollableElement } =
		useToolbarUI();
	const [isOpen, setIsOpen] = useState(false);
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const { connectivityMode, isAllowed } = useSharedPluginStateWithSelector(
		api,
		['connectivity', 'typeAhead'],
		(states) => ({
			connectivityMode: states.connectivityState?.mode,
			isAllowed: states.typeAheadState?.isAllowed,
		}),
	);

	const close = useCallback((restoreFocus = false) => {
		setIsOpen(false);
		if (restoreFocus) {
			requestAnimationFrame(() => buttonRef.current?.focus());
		}
	}, []);
	const open = useCallback(() => {
		setIsOpen(true);
	}, []);
	const onPopupUnmount = useCallback(() => {
		// Outside dismissal must not move focus away from the element that was clicked.
		setIsOpen(false);
	}, []);
	const closeAndRestoreFocus = useCallback(() => close(true), [close]);
	const closeForSelection = useCallback(() => close(false), [close]);

	if (!api?.insertBlock || !editorView) {
		return null;
	}

	return (
		<>
			<ToolbarTooltip
				content={
					<ToolTipContent
						description={formatMessage(messages.insertMenu)}
						keymap={insertElements}
					/>
				}
			>
				<ToolbarButton
					ariaKeyshortcuts={getAriaKeyshortcuts(insertElements)}
					iconBefore={<AddIcon size="small" label={formatMessage(messages.insertMenu)} />}
					isDisabled={!isAllowed || isDisabled}
					isSelected={isOpen}
					onClick={isOpen ? () => close(true) : open}
					ref={buttonRef}
					testId={TOOLBAR_BUTTON_TEST_ID.INSERT}
				/>
			</ToolbarTooltip>
			{isOpen && buttonRef.current && (
				<Popup
					alignX="right"
					boundariesElement={popupsBoundariesElement}
					fitHeight={DEFAULT_MENU_MAX_HEIGHT + FIT_HEIGHT_BUFFER}
					fitWidth={350}
					mountTo={popupsMountPoint}
					offset={POPUP_OFFSET}
					onUnmount={onPopupUnmount}
					preventOverflow
					scrollableElement={popupsScrollableElement}
					target={buttonRef.current}
					zIndex={akEditorMenuZIndex}
				>
					<RegisteredInsertMenuContent
						api={api}
						editorView={editorView}
						isOffline={isOfflineMode(connectivityMode)}
						onClose={closeAndRestoreFocus}
						onDismiss={closeForSelection}
						onSelect={closeForSelection}
						target={buttonRef.current}
					/>
				</Popup>
			)}
		</>
	);
};
