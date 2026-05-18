import React from 'react';

import { useIntl } from 'react-intl';

import { addColumnBefore, tooltip } from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import {
	TableColumnAddLeftIcon,
	ToolbarDropdownItem,
	ToolbarKeyboardShortcutHint,
} from '@atlaskit/editor-toolbar';

export const AddColumnLeftItem = (): React.JSX.Element => {
	const { formatMessage } = useIntl();

	return (
		<ToolbarDropdownItem
			elemBefore={<TableColumnAddLeftIcon color="currentColor" label="" size="small" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut={tooltip(addColumnBefore) ?? ''} />}
		>
			{formatMessage(messages.addColumnLeft)}
		</ToolbarDropdownItem>
	);
};
