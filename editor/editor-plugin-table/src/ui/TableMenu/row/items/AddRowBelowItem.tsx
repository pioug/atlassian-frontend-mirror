import React from 'react';

import { useIntl } from 'react-intl';

import { addRowAfter, tooltip } from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import {
	TableRowAddBelowIcon,
	ToolbarDropdownItem,
	ToolbarKeyboardShortcutHint,
} from '@atlaskit/editor-toolbar';

export const AddRowBelowItem = (): React.JSX.Element => {
	const { formatMessage } = useIntl();
	return (
		<ToolbarDropdownItem
			elemBefore={<TableRowAddBelowIcon color="currentColor" label="" size="small" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut={tooltip(addRowAfter) ?? ''} />}
		>
			{formatMessage(messages.addRowBelow)}
		</ToolbarDropdownItem>
	);
};
