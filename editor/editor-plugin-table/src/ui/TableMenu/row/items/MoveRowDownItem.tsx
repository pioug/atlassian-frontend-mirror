import React from 'react';

import { useIntl } from 'react-intl';

import { moveRowDown, moveRowDownOld, tooltip } from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import {
	TableRowMoveDownIcon,
	ToolbarDropdownItem,
	ToolbarKeyboardShortcutHint,
} from '@atlaskit/editor-toolbar';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import {
	type TableMenuContextValue,
	useTableMenuContext,
} from '../../shared/TableMenuContext';

const getMoveRowDownShortcut = () =>
	tooltip(
		expValEquals('editor-a11y-fy26-keyboard-move-row-column', 'isEnabled', true)
			? moveRowDown
			: moveRowDownOld,
	);

/** Move row down is hidden when the selection includes the last row (cannot move further down). */
const shouldShowMoveRowDown = (tableMenuContext?: TableMenuContextValue): boolean =>
	!tableMenuContext?.isLastRow;

export const MoveRowDownItem = (): React.JSX.Element | null => {
	const tableMenuContext = useTableMenuContext();
	const { formatMessage } = useIntl();

	if (!shouldShowMoveRowDown(tableMenuContext)) {
		return null;
	}

	return (
		<ToolbarDropdownItem
			elemBefore={<TableRowMoveDownIcon color="currentColor" label="" size="small" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut={getMoveRowDownShortcut() ?? ''} />}
		>
			{formatMessage(messages.moveRowDown, { 0: 1 })}
		</ToolbarDropdownItem>
	);
};
