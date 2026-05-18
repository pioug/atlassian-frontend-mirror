import React from 'react';

import { useIntl } from 'react-intl';

import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { ArrowDownIcon, ToolbarDropdownItem } from '@atlaskit/editor-toolbar';

export const SortDecreasingItem = (): React.JSX.Element => {
	const { formatMessage } = useIntl();

	return (
		<ToolbarDropdownItem
			isDisabled
			elemBefore={<ArrowDownIcon color="currentColor" label="" size="small" />}
		>
			{formatMessage(messages.sortColumnDecreasing)}
		</ToolbarDropdownItem>
	);
};
