import React from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { deleteRow, tooltip } from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import { getSelectionRect } from '@atlaskit/editor-tables/utils';
import {
	DeleteIcon,
	ToolbarDropdownItem,
	ToolbarKeyboardShortcutHint,
} from '@atlaskit/editor-toolbar';

import { clearHoverSelection, hoverRows } from '../../../../pm-plugins/commands';
import { deleteRowsWithAnalytics } from '../../../../pm-plugins/commands/commands-with-analytics';
import { getSelectedRowIndexes } from '../../../../pm-plugins/utils/selection';
import type { TableSharedStateInternal } from '../../../../types';
import { useTableMenuContext } from '../../shared/TableMenuContext';
import type { TableMenuComponentsParams } from '../../shared/types';

export const DeleteRowItem = (props: TableMenuComponentsParams): React.JSX.Element => {
	const { api } = props;
	const { editorView } = useEditorToolbar();
	const tableMenuContext = useTableMenuContext();
	const { isHeaderRowRequired } = useSharedPluginStateWithSelector(
		api ?? undefined,
		['table'],
		(states) => ({
			isHeaderRowRequired: (states.tableState as TableSharedStateInternal | undefined)?.pluginConfig
				?.isHeaderRowRequired,
		}),
	);
	const selectedRowCount = tableMenuContext?.selectedRowCount ?? 1;
	const { formatMessage } = useIntl();

	const handleMouseEnter = () => {
		if (!editorView) {
			return;
		}

		const selectionRect = getSelectionRect(editorView.state.selection);
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

		const selectionRect = getSelectionRect(editorView.state.selection);
		if (!selectionRect) {
			return;
		}

		deleteRowsWithAnalytics(api?.analytics?.actions)(
			INPUT_METHOD.TABLE_CONTEXT_MENU,
			selectionRect,
			!!isHeaderRowRequired,
		)(editorView.state, editorView.dispatch);
	};

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			onFocus={handleMouseEnter}
			onMouseEnter={handleMouseEnter}
			onBlur={handleMouseLeave}
			onMouseLeave={handleMouseLeave}
			elemBefore={<DeleteIcon color="currentColor" label="" size="small" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut={tooltip(deleteRow) ?? ''} />}
		>
			{formatMessage(messages.removeRows, { 0: selectedRowCount })}
		</ToolbarDropdownItem>
	);
};
