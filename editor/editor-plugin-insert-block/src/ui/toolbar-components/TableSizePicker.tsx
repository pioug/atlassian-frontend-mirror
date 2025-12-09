import React, { useRef } from 'react';

import { useIntl } from 'react-intl-next';

import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import {
	MoreItemsIcon,
	ToolbarButton,
	ToolbarTooltip,
	useToolbarUI,
} from '@atlaskit/editor-toolbar';

import { useTableSelectorPopup } from './hooks/useTableSelectorPopup';
import { TableSelectorPopupWrapper } from './popups/TableSelectorPopupWrapper';
import type { BaseToolbarButtonProps } from './shared/types';

interface TableSizePickerProps extends BaseToolbarButtonProps {
	tableSelectorSupported?: boolean;
}

export const TableSizePicker = ({
	api,
	tableSelectorSupported,
}: TableSizePickerProps): React.JSX.Element | null => {
	const { formatMessage } = useIntl();
	const tableSizePickerRef = useRef<HTMLButtonElement | null>(null);
	const { popupsMountPoint, popupsBoundariesElement, popupsScrollableElement } = useToolbarUI();

	const tableSelectorPopup = useTableSelectorPopup({
		api,
		buttonRef: tableSizePickerRef,
	});

	if (!api?.table || !tableSelectorSupported) {
		return null;
	}

	const onClick = (event: React.MouseEvent | React.KeyboardEvent) => {
		if (event.detail === 0) {
			tableSelectorPopup.handleKeyboardOpen(event as React.KeyboardEvent);
		}
		tableSelectorPopup.toggle();
	};

	return (
		<>
			<TableSelectorPopupWrapper
				isOpen={tableSelectorPopup.isOpen}
				targetRef={tableSizePickerRef}
				isOpenedByKeyboard={tableSelectorPopup.isOpenedByKeyboard}
				onSelection={tableSelectorPopup.handleSelectedTableSize}
				onClickOutside={tableSelectorPopup.handleClickOutside}
				onEscapeKeydown={tableSelectorPopup.handleEscapeKeydown}
				onUnmount={tableSelectorPopup.onPopupUnmount}
				popupsMountPoint={popupsMountPoint}
				popupsBoundariesElement={popupsBoundariesElement}
				popupsScrollableElement={popupsScrollableElement}
			/>
			<ToolbarTooltip content={formatMessage(messages.tableSelector)}>
				<ToolbarButton
					iconBefore={<MoreItemsIcon label={formatMessage(messages.tableSelector)} />}
					onClick={onClick}
					isSelected={tableSelectorPopup.isOpen}
					ref={tableSizePickerRef}
				/>
			</ToolbarTooltip>
		</>
	);
};
