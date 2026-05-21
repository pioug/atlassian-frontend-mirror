import React from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { addRowAfter, tooltip } from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import { getSelectionRect } from '@atlaskit/editor-tables/utils';
import {
	TableRowAddBelowIcon,
	ToolbarDropdownItem,
	ToolbarKeyboardShortcutHint,
} from '@atlaskit/editor-toolbar';

import { insertRowWithAnalytics } from '../../../../pm-plugins/commands/commands-with-analytics';
import type { TableMenuComponentsParams } from '../../shared/types';

export const AddRowBelowItem = (props: TableMenuComponentsParams): React.JSX.Element => {
	const { api } = props;
	const { editorView } = useEditorToolbar();
	const { formatMessage } = useIntl();

	const handleClick = () => {
		if (!editorView) {
			return;
		}

		const selectionRect = getSelectionRect(editorView.state.selection);
		const index = selectionRect?.bottom;
		if (index === undefined) {
			return;
		}
		insertRowWithAnalytics(api?.analytics?.actions)(INPUT_METHOD.TABLE_CONTEXT_MENU, {
			index,
			moveCursorToInsertedRow: true,
		})(editorView.state, editorView.dispatch);
	};

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			elemBefore={<TableRowAddBelowIcon color="currentColor" label="" size="small" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut={tooltip(addRowAfter) ?? ''} />}
		>
			{formatMessage(messages.addRowBelow)}
		</ToolbarDropdownItem>
	);
};
