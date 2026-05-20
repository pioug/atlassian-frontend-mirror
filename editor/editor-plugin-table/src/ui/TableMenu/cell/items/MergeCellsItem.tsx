import React from 'react';

import { useIntl } from 'react-intl';

import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { TableCellMergeIcon, ToolbarDropdownItem } from '@atlaskit/editor-toolbar';

import {
	useTableMenuContext,
	type TableMenuContextValue,
} from '../../shared/TableMenuContext';

/**
 * Merge cells is only visible when the active selection can actually be merged
 * (multi-cell, non-overlapping).
 */
const shouldShowMergeCells = (tableMenuContext?: TableMenuContextValue): boolean =>
	tableMenuContext?.canMergeCells === true;

export const MergeCellsItem = (): React.JSX.Element | null => {
	const tableMenuContext = useTableMenuContext();
	const { formatMessage } = useIntl();

	if (!shouldShowMergeCells(tableMenuContext)) {
		return null;
	}

	return (
		<ToolbarDropdownItem elemBefore={<TableCellMergeIcon label="" size="small" />}>
			{formatMessage(messages.mergeCells)}
		</ToolbarDropdownItem>
	);
};
