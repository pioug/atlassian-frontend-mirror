import React from 'react';

import { useIntl } from 'react-intl';

import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { ArrowUpIcon, ToolbarDropdownItem } from '@atlaskit/editor-toolbar';

export const SortIncreasingItem = (): React.JSX.Element => {
	const { formatMessage } = useIntl();

	return (
		<ToolbarDropdownItem
			isDisabled
			elemBefore={<ArrowUpIcon color="currentColor" label="" size="small" />}
		>
			{formatMessage(messages.sortColumnIncreasing)}
		</ToolbarDropdownItem>
	);
};
