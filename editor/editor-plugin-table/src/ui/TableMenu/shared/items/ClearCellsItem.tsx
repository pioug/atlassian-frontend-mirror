import React from 'react';

import { useIntl } from 'react-intl';

import { backspace, tooltip } from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import {
	CrossIcon,
	ToolbarDropdownItem,
	ToolbarKeyboardShortcutHint,
} from '@atlaskit/editor-toolbar';

export const ClearCellsItem = (): React.JSX.Element => {
	const { formatMessage } = useIntl();
	return (
		<ToolbarDropdownItem
			elemBefore={<CrossIcon color="currentColor" label="" size="small" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut={tooltip(backspace) ?? ''} />}
		>
			{formatMessage(messages.clearCells, { 0: 1 })}
		</ToolbarDropdownItem>
	);
};
