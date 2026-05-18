import React from 'react';

import { useIntl } from 'react-intl';

import { deleteRow, tooltip } from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { DeleteIcon, ToolbarDropdownItem, ToolbarKeyboardShortcutHint } from '@atlaskit/editor-toolbar';

export const DeleteRowItem = (): React.JSX.Element => {
	const { formatMessage } = useIntl();
	return (
		<ToolbarDropdownItem
			elemBefore={<DeleteIcon color="currentColor" label="" size="small" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut={tooltip(deleteRow) ?? ''} />}
		>
			{formatMessage(messages.removeRows, { 0: 1 })}
		</ToolbarDropdownItem>
	);
};
