import React from 'react';

import { useIntl } from 'react-intl';

import { moveRowUp, moveRowUpOld, tooltip } from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import {
	TableRowMoveUpIcon,
	ToolbarDropdownItem,
	ToolbarKeyboardShortcutHint,
} from '@atlaskit/editor-toolbar';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

const getMoveRowUpShortcut = () =>
	tooltip(
		expValEquals('editor-a11y-fy26-keyboard-move-row-column', 'isEnabled', true)
			? moveRowUp
			: moveRowUpOld,
	);

export const MoveRowUpItem = (): React.JSX.Element => {
	const { formatMessage } = useIntl();
	return (
		<ToolbarDropdownItem
			elemBefore={<TableRowMoveUpIcon color="currentColor" label="" size="small" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut={getMoveRowUpShortcut() ?? ''} />}
		>
			{formatMessage(messages.moveRowUp, { 0: 1 })}
		</ToolbarDropdownItem>
	);
};
