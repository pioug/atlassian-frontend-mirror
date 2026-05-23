import React from 'react';

import { useIntl } from 'react-intl';

import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { TableCellSplitIcon, ToolbarDropdownItem } from '@atlaskit/editor-toolbar';

import { useTableMenuContext, type TableMenuContextValue } from '../../shared/TableMenuContext';

/**
 * Split cell is only visible when the active selection sits in a cell whose
 * `rowspan` or `colspan` is greater than one.
 */
const shouldShowSplitCell = (tableMenuContext?: TableMenuContextValue): boolean =>
	tableMenuContext?.canSplitCell === true;

export const SplitCellItem = (): React.JSX.Element | null => {
	const tableMenuContext = useTableMenuContext();
	const { formatMessage } = useIntl();

	if (!shouldShowSplitCell(tableMenuContext)) {
		return null;
	}

	return (
		<ToolbarDropdownItem elemBefore={<TableCellSplitIcon label="" size="small" />}>
			{formatMessage(messages.splitCell)}
		</ToolbarDropdownItem>
	);
};
