import React from 'react';

import { useIntl } from 'react-intl-next';

import { listMessages } from '@atlaskit/editor-common/messages';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import ListBulletedIcon from '@atlaskit/icon/core/list-bulleted';

export const BulletedListMenuItem = () => {
	const { formatMessage } = useIntl();
	return (
		<ToolbarDropdownItem
			elemBefore={<ListBulletedIcon label={formatMessage(listMessages.bulletedList)} />}
		>
			{formatMessage(listMessages.bulletedList)}
		</ToolbarDropdownItem>
	);
};
