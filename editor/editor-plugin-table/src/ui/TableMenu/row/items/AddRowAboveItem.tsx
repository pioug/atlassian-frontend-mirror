import React from 'react';

import { useIntl } from 'react-intl';

import { addRowBefore, tooltip } from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import {
	TableRowAddAboveIcon,
	ToolbarDropdownItem,
	ToolbarKeyboardShortcutHint,
} from '@atlaskit/editor-toolbar';

export const AddRowAboveItem = (): React.JSX.Element => {
	const { formatMessage } = useIntl();
	return (
		<ToolbarDropdownItem
			elemBefore={<TableRowAddAboveIcon color="currentColor" label="" size="small" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut={tooltip(addRowBefore) ?? ''} />}
		>
			{formatMessage(messages.addRowAbove)}
		</ToolbarDropdownItem>
	);
};
