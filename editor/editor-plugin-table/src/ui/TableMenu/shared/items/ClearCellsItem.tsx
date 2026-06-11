import React from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { backspace, tooltip } from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import {
	CrossIcon,
	ToolbarDropdownItem,
	ToolbarKeyboardShortcutHint,
} from '@atlaskit/editor-toolbar';

import { closeActiveTableMenu } from '../../../../pm-plugins/commands';
import { emptyMultipleCellsWithAnalytics } from '../../../../pm-plugins/commands/commands-with-analytics';
import { getPluginState } from '../../../../pm-plugins/plugin-factory';
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
			elemAfter={<ToolbarKeyboardShortcutHint shortcut={tooltip(backspace) ?? ''} />}
		>
			{formatMessage(messages.clearCells, { 0: selectedCellCount })}
		</ToolbarDropdownItem>
	);
};
