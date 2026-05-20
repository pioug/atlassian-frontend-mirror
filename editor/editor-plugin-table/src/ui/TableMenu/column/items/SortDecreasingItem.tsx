import React from 'react';

import { useIntl } from 'react-intl';

import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { ArrowDownIcon, ToolbarDropdownItem } from '@atlaskit/editor-toolbar';

import { useTableMenuContext } from '../../shared/TableMenuContext';

export const SortDecreasingItem = (): React.JSX.Element => {
	const tableMenuContext = useTableMenuContext();
	const { formatMessage } = useIntl();

	return (
		<ToolbarDropdownItem
			isDisabled={Boolean(tableMenuContext?.hasMergedCellsInTable)}
			elemBefore={<ArrowDownIcon color="currentColor" label="" size="small" />}
		>
			{formatMessage(messages.sortColumnDecreasing)}
		</ToolbarDropdownItem>
	);
};
