import React, { useRef, useState } from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { TableSelectorPopup } from '@atlaskit/editor-common/ui';
import { MoreItemsIcon, ToolbarButton, ToolbarTooltip } from '@atlaskit/editor-toolbar';

import type { InsertBlockPlugin } from '../../insertBlockPluginType';

import { isDetachedElement } from './utils/utils';

type TableSizePickerProps = {
	api?: ExtractInjectionAPI<InsertBlockPlugin>;
	tableSelectorSupported?: boolean;
};
export const TableSizePicker = ({ api, tableSelectorSupported }: TableSizePickerProps) => {
	const { formatMessage } = useIntl();
	const { editorView } = useEditorToolbar();
	const [tableSizePickerOpen, setTableSizePickerOpen] = useState(false);
	const [isOpenedByKeyboard, setIsOpenedByKeyboard] = useState(false);

	const tableSizePickerRef = useRef<HTMLButtonElement | null>(null);

	if (!editorView?.state.schema.nodes.table || !tableSelectorSupported) {
		return null;
	}

	const handleSelectedTableSize = (rowsCount: number, colsCount: number) => {
		// workaround to solve race condition where cursor is not placed correctly inside table
		queueMicrotask(() => {
			api?.core?.actions.execute(
				api?.table?.commands.insertTableWithSize(rowsCount, colsCount, INPUT_METHOD.PICKER),
			);
		});
		setTableSizePickerOpen(false);
	};

	const handleTableSelectorClickOutside = (e: MouseEvent) => {
		// Ignore click events for detached elements.
		if (e.target instanceof HTMLElement && !isDetachedElement(e.target)) {
			setTableSizePickerOpen(false);
		}
	};

	const handleTableSelectorPressEscape = () => {
		setTableSizePickerOpen(false);
		tableSizePickerRef.current?.focus();
	};

	const onUnmount = () => {
		api?.core.actions.focus();
	};
	const onClick = (event: React.MouseEvent | React.KeyboardEvent) => {
		setIsOpenedByKeyboard(event.detail === 0 ? true : false);
		setTableSizePickerOpen(!tableSizePickerOpen);
	};

	return (
		<>
			{tableSizePickerRef.current && tableSizePickerOpen && (
				<TableSelectorPopup
					allowOutsideSelection
					target={tableSizePickerRef.current}
					onUnmount={onUnmount}
					onSelection={handleSelectedTableSize}
					popupsMountPoint={tableSizePickerRef.current}
					handleClickOutside={handleTableSelectorClickOutside}
					handleEscapeKeydown={handleTableSelectorPressEscape}
					isOpenedByKeyboard={isOpenedByKeyboard}
				/>
			)}
			<ToolbarTooltip content={formatMessage(messages.tableSelector)}>
				<ToolbarButton
					iconBefore={<MoreItemsIcon label={formatMessage(messages.tableSelector)} />}
					onClick={onClick}
					isSelected={tableSizePickerOpen}
					ref={tableSizePickerRef}
				/>
			</ToolbarTooltip>
		</>
	);
};
