import React from 'react';

import { useIntl } from 'react-intl';

import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { ArrowUpIcon, ToolbarDropdownItem } from '@atlaskit/editor-toolbar';

import { useTableMenuContext } from '../../shared/TableMenuContext';

export const SortIncreasingItem = (): React.JSX.Element => {
	const tableMenuContext = useTableMenuContext();
	const { formatMessage } = useIntl();

	return (
		<ToolbarDropdownItem
			isDisabled={Boolean(tableMenuContext?.hasMergedCellsInTable)}
			elemBefore={<ArrowUpIcon color="currentColor" label="" size="small" />}
		>
			{formatMessage(messages.sortColumnIncreasing)}
		</ToolbarDropdownItem>
	);
};
