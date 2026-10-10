import React from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import { backspace, tooltip } from '@atlaskit/editor-common/keymaps';
import { messages } from '@atlaskit/editor-common/messages/table';
import { CrossIcon } from '@atlaskit/editor-toolbar/cross-icon';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar/toolbar-dropdown-item';
import { ToolbarKeyboardShortcutHint } from '@atlaskit/editor-toolbar/toolbar-keyboard-shortcut-hint';

import { closeActiveTableMenu } from '../../../../pm-plugins/commands';
import { emptyMultipleCellsWithAnalytics } from '../../../../pm-plugins/commands/commands-with-analytics';
import { getPluginState } from '../../../../pm-plugins/plugin-factory';
import { CELL_MENU } from '../../cell/keys';
import { useTableMenuContext } from '../TableMenuContext';
import type { TableMenuComponentsParams } from '../types';

export const ClearCellsItem = ({ api }: TableMenuComponentsParams): React.JSX.Element => {
	const tableMenuContext = useTableMenuContext();
	const { editorView } = tableMenuContext ?? {};
	const { formatMessage } = useIntl();
	const selectedCellCount = Math.max(
		tableMenuContext?.selectedColumnCount ?? 1,
		tableMenuContext?.selectedRowCount ?? 1,
	);
	const shouldShowShortcut =
		tableMenuContext?.surface.key !== CELL_MENU.key || selectedCellCount > 1;

	const handleClick = () => {
		if (!editorView) {
			return;
		}
		const { targetCellPosition } = getPluginState(editorView.state);
		emptyMultipleCellsWithAnalytics(api?.analytics?.actions)(
			INPUT_METHOD.TABLE_CONTEXT_MENU,
			targetCellPosition,
		)(editorView.state, editorView.dispatch);
		api?.core.actions.execute(closeActiveTableMenu(api));
		api?.core.actions.focus();
	};

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			elemBefore={<CrossIcon color="currentColor" label="" size="small" />}
			elemAfter={
				shouldShowShortcut ? (
					<ToolbarKeyboardShortcutHint shortcut={tooltip(backspace) ?? ''} />
				) : undefined
			}
		>
			{formatMessage(messages.clearCells, { 0: selectedCellCount })}
		</ToolbarDropdownItem>
	);
};
