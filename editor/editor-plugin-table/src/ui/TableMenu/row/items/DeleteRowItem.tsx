import React from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import { deleteRow, tooltip } from '@atlaskit/editor-common/keymaps';
import { messages } from '@atlaskit/editor-common/messages/table';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import { DeleteIcon } from '@atlaskit/editor-toolbar/delete-icon';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar/toolbar-dropdown-item';
import { ToolbarKeyboardShortcutHint } from '@atlaskit/editor-toolbar/toolbar-keyboard-shortcut-hint';

import {
	clearHoverSelection,
	closeActiveTableMenu,
	hoverRows,
} from '../../../../pm-plugins/commands';
import { deleteRowsWithAnalytics } from '../../../../pm-plugins/commands/commands-with-analytics';
import { getSelectedRowIndexes } from '../../../../pm-plugins/utils/selection';
import type { TableSharedStateInternal } from '../../../../types';
import { CELL_MENU } from '../../cell/keys';
import { getMenuSelectionRect } from '../../shared/selection';
import { useTableMenuContext } from '../../shared/TableMenuContext';
import type { TableMenuComponentsParams } from '../../shared/types';

export const DeleteRowItem = (props: TableMenuComponentsParams): React.JSX.Element => {
	const { api } = props;
	const tableMenuContext = useTableMenuContext();
	const { editorView } = tableMenuContext ?? {};
	const { isHeaderRowRequired } = useSharedPluginStateWithSelector(
		api ?? undefined,
		['table'],
		(states) => ({
			isHeaderRowRequired: (states.tableState as TableSharedStateInternal | undefined)?.pluginConfig
				?.isHeaderRowRequired,
		}),
	);
	const selectedRowCount = tableMenuContext?.selectedRowCount ?? 1;
	const shouldShowShortcut = tableMenuContext?.surface.key !== CELL_MENU.key;
	const { formatMessage } = useIntl();

	const handleMouseEnter = () => {
		if (!editorView) {
			return;
		}

		const selectionRect = getMenuSelectionRect(editorView.state.selection);
		if (!selectionRect) {
			return;
		}

		hoverRows(getSelectedRowIndexes(selectionRect), true)(editorView.state, editorView.dispatch);
	};

	const handleMouseLeave = () => {
		if (!editorView) {
			return;
		}
		clearHoverSelection()(editorView.state, editorView.dispatch);
	};

	const handleClick = () => {
		if (!editorView) {
			return;
		}

		const selectionRect = getMenuSelectionRect(editorView.state.selection);
		if (!selectionRect) {
			return;
		}

		deleteRowsWithAnalytics(api?.analytics?.actions)(
			INPUT_METHOD.TABLE_CONTEXT_MENU,
			selectionRect,
			!!isHeaderRowRequired,
		)(editorView.state, editorView.dispatch);
		api?.core.actions.execute(closeActiveTableMenu(api));
		api?.core.actions.focus();
	};

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			onFocus={handleMouseEnter}
			onMouseEnter={handleMouseEnter}
			onBlur={handleMouseLeave}
			onMouseLeave={handleMouseLeave}
			elemBefore={<DeleteIcon color="currentColor" label="" size="small" />}
			elemAfter={
				shouldShowShortcut ? (
					<ToolbarKeyboardShortcutHint shortcut={tooltip(deleteRow) ?? ''} />
				) : undefined
			}
		>
			{formatMessage(messages.removeRows, { 0: selectedRowCount })}
		</ToolbarDropdownItem>
	);
};
