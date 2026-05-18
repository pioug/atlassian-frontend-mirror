import React from 'react';

import { useIntl } from 'react-intl';

import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { TableColumnsDistributeIcon, ToolbarDropdownItem } from '@atlaskit/editor-toolbar';

export const DistributeColumnsItem = (): React.JSX.Element => {
	const { formatMessage } = useIntl();

	return (
		<ToolbarDropdownItem
			elemBefore={<TableColumnsDistributeIcon color="currentColor" label="" size="small" />}
		>
			{formatMessage(messages.distributeColumns)}
		</ToolbarDropdownItem>
	);
};
