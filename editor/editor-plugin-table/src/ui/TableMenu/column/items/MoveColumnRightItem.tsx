import React from 'react';

import { useIntl } from 'react-intl';

import { moveColumnRight, tooltip } from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import {
	TableColumnMoveRightIcon,
	ToolbarDropdownItem,
	ToolbarKeyboardShortcutHint,
} from '@atlaskit/editor-toolbar';

export const MoveColumnRightItem = (): React.JSX.Element => {
	const { formatMessage } = useIntl();

	return (
		<ToolbarDropdownItem
			elemBefore={<TableColumnMoveRightIcon color="currentColor" label="" size="small" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut={tooltip(moveColumnRight) ?? ''} />}
		>
			{formatMessage(messages.moveColumnRight, { 0: 1 })}
		</ToolbarDropdownItem>
	);
};
