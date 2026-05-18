import React from 'react';

import { useIntl } from 'react-intl';

import { addColumnAfter, tooltip } from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import {
	TableColumnAddRightIcon,
	ToolbarDropdownItem,
	ToolbarKeyboardShortcutHint,
} from '@atlaskit/editor-toolbar';

export const AddColumnRightItem = (): React.JSX.Element => {
	const { formatMessage } = useIntl();

	return (
		<ToolbarDropdownItem
			elemBefore={<TableColumnAddRightIcon color="currentColor" label="" size="small" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut={tooltip(addColumnAfter) ?? ''} />}
		>
			{formatMessage(messages.addColumnRight)}
		</ToolbarDropdownItem>
	);
};
