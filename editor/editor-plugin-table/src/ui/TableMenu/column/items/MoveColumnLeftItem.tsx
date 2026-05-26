import React from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { moveColumnLeft, tooltip } from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { getSelectionRect } from '@atlaskit/editor-tables/utils';
import { ToolbarDropdownItem, ToolbarKeyboardShortcutHint } from '@atlaskit/editor-toolbar';
import TableColumnMoveLeftIcon from '@atlaskit/icon/core/table-column-move-left';

import { closeActiveTableMenu } from '../../../../pm-plugins/commands';
import { moveSourceWithAnalytics } from '../../../../pm-plugins/drag-and-drop/commands-with-analytics';
import { getPluginState } from '../../../../pm-plugins/plugin-factory';
import { getSelectedColumnIndexes } from '../../../../pm-plugins/utils/selection';
import type { TableSharedStateInternal } from '../../../../types';
import { TABLE_COLUMN } from '../../shared/consts';
import { useTableMenuContext } from '../../shared/TableMenuContext';
import type { TableMenuComponentsParams } from '../../shared/types';

const shouldShowMoveColumnLeft = (isFirstColumn?: boolean): boolean => !isFirstColumn;

export const MoveColumnLeftItem = (props: TableMenuComponentsParams): React.JSX.Element | null => {
	const { api } = props;
	const tableMenuContext = useTableMenuContext();
	const { editorView } = tableMenuContext ?? {};
	const { tableNode } = useSharedPluginStateWithSelector(api ?? undefined, ['table'], (states) => ({
		tableNode: (states.tableState as TableSharedStateInternal | undefined)?.tableNode,
	}));
	const selectedColumnCount = tableMenuContext?.selectedColumnCount ?? 1;
	const { formatMessage } = useIntl();

	const handleClick = () => {
		if (!editorView) {
			return;
		}

		const selectionRect = getSelectionRect(editorView.state.selection);
		if (!selectionRect) {
			return;
		}

		moveSourceWithAnalytics(
			api?.analytics?.actions,
			api?.accessibilityUtils?.actions.ariaNotify,
			getPluginState(editorView.state).getIntl,
		)(
			INPUT_METHOD.TABLE_CONTEXT_MENU,
			TABLE_COLUMN,
			getSelectedColumnIndexes(selectionRect),
			selectionRect.left - 1,
		)(editorView.state, editorView.dispatch);
		api?.core.actions.execute(closeActiveTableMenu());
		api?.core.actions.focus();
	};

	if (!tableNode || !shouldShowMoveColumnLeft(tableMenuContext?.isFirstColumn)) {
		return null;
	}

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			elemBefore={<TableColumnMoveLeftIcon color="currentColor" label="" size="small" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut={tooltip(moveColumnLeft) ?? ''} />}
		>
			{formatMessage(messages.moveColumnLeft, { 0: selectedColumnCount })}
		</ToolbarDropdownItem>
	);
};
