import React from 'react';

import { useIntl } from 'react-intl';

import { deleteColumn, tooltip } from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { DeleteIcon, ToolbarDropdownItem, ToolbarKeyboardShortcutHint } from '@atlaskit/editor-toolbar';

export const DeleteColumnItem = (): React.JSX.Element => {
	const { formatMessage } = useIntl();

	return (
		<ToolbarDropdownItem
			elemBefore={<DeleteIcon color="currentColor" label="" size="small" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut={tooltip(deleteColumn) ?? ''} />}
		>
			{formatMessage(messages.removeColumns, { 0: 1 })}
		</ToolbarDropdownItem>
	);
};
