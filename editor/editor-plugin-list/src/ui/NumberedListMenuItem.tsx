import React from 'react';

import { useIntl } from 'react-intl-next';

import { listMessages } from '@atlaskit/editor-common/messages';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import ListNumberedIcon from '@atlaskit/icon/core/list-numbered';

export const NumberedListMenuItem = () => {
	const { formatMessage } = useIntl();
	return (
		<ToolbarDropdownItem
			elemBefore={<ListNumberedIcon label={formatMessage(listMessages.orderedList)} />}
		>
			{formatMessage(listMessages.orderedList)}
		</ToolbarDropdownItem>
	);
};
