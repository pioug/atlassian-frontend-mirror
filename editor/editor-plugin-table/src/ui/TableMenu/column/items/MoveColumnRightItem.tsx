import React from 'react';

import { useIntl } from 'react-intl';

import { moveColumnRight, moveColumnRightOld, tooltip } from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import {
	TableColumnMoveRightIcon,
	ToolbarDropdownItem,
	ToolbarKeyboardShortcutHint,
} from '@atlaskit/editor-toolbar';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

const getMoveColumnRightShortcut = () =>
	tooltip(
		expValEquals('editor-a11y-fy26-keyboard-move-row-column', 'isEnabled', true)
			? moveColumnRight
			: moveColumnRightOld,
	);

export const MoveColumnRightItem = (): React.JSX.Element => {
	const { formatMessage } = useIntl();

	return (
		<ToolbarDropdownItem
			elemBefore={<TableColumnMoveRightIcon color="currentColor" label="" size="small" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut={getMoveColumnRightShortcut() ?? ''} />}
		>
			{formatMessage(messages.moveColumnRight, { 0: 1 })}
		</ToolbarDropdownItem>
	);
};
