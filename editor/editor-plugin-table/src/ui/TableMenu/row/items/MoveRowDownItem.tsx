import React from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { moveRowDown, tooltip } from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import { getSelectionRect } from '@atlaskit/editor-tables/utils';
import {
	TableRowMoveDownIcon,
	ToolbarDropdownItem,
	ToolbarKeyboardShortcutHint,
} from '@atlaskit/editor-toolbar';

import { moveSourceWithAnalytics } from '../../../../pm-plugins/drag-and-drop/commands-with-analytics';
import { getPluginState } from '../../../../pm-plugins/plugin-factory';
import { getSelectedRowIndexes } from '../../../../pm-plugins/utils/selection';
import type { TableSharedStateInternal } from '../../../../types';
import { TABLE_ROW } from '../../shared/consts';
import { useTableMenuContext } from '../../shared/TableMenuContext';
import type { TableMenuComponentsParams } from '../../shared/types';

const shouldShowMoveRowDown = (isLastRow?: boolean): boolean => !isLastRow;

export const MoveRowDownItem = (props: TableMenuComponentsParams): React.JSX.Element | null => {
	const { api } = props;
	const { editorView } = useEditorToolbar();
	const tableMenuContext = useTableMenuContext();
	const { tableNode } = useSharedPluginStateWithSelector(api ?? undefined, ['table'], (states) => ({
		tableNode: (states.tableState as TableSharedStateInternal | undefined)?.tableNode,
	}));
	const selectedRowCount = tableMenuContext?.selectedRowCount ?? 1;
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
			TABLE_ROW,
			getSelectedRowIndexes(selectionRect),
			selectionRect.bottom,
		)(editorView.state, editorView.dispatch);
	};

	if (!tableNode || !shouldShowMoveRowDown(tableMenuContext?.isLastRow)) {
		return null;
	}

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			elemBefore={<TableRowMoveDownIcon color="currentColor" label="" size="small" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut={tooltip(moveRowDown) ?? ''} />}
		>
			{formatMessage(messages.moveRowDown, { 0: selectedRowCount })}
		</ToolbarDropdownItem>
	);
};
