import React from 'react';

import { useIntl } from 'react-intl';

import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { TableColumnsDistributeIcon, ToolbarDropdownItem } from '@atlaskit/editor-toolbar';

import {
	useTableMenuContext,
	type TableMenuContextValue,
} from '../../shared/TableMenuContext';

/** Distribute columns is only visible when more than one column is selected. */
const shouldShowDistributeColumns = (tableMenuContext?: TableMenuContextValue): boolean =>
	(tableMenuContext?.selectedColumnCount ?? 0) > 1;

export const DistributeColumnsItem = (): React.JSX.Element | null => {
	const tableMenuContext = useTableMenuContext();
	const { formatMessage } = useIntl();

	if (!shouldShowDistributeColumns(tableMenuContext)) {
		return null;
	}

	return (
		<ToolbarDropdownItem
			elemBefore={<TableColumnsDistributeIcon color="currentColor" label="" size="small" />}
		>
			{formatMessage(messages.distributeColumns)}
		</ToolbarDropdownItem>
	);
};
