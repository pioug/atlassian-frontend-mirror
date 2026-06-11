import React from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { addRowBefore, tooltip } from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { getSelectionRect } from '@atlaskit/editor-tables/utils';
import {
	TableRowAddAboveIcon,
	ToolbarDropdownItem,
	ToolbarKeyboardShortcutHint,
} from '@atlaskit/editor-toolbar';

import { closeActiveTableMenu } from '../../../../pm-plugins/commands';
import { insertRowWithAnalytics } from '../../../../pm-plugins/commands/commands-with-analytics';
import { useTableMenuContext } from '../../shared/TableMenuContext';
import type { TableMenuComponentsParams } from '../../shared/types';

export const AddRowAboveItem = (props: TableMenuComponentsParams): React.JSX.Element => {
	const { api } = props;
	const { editorView } = useTableMenuContext() ?? {};
	const { formatMessage } = useIntl();

	const handleClick = () => {
		if (!editorView) {
			return;
		}

		const selectionRect = getSelectionRect(editorView.state.selection);
		const index = selectionRect?.top;
		if (index === undefined) {
			return;
		}
		insertRowWithAnalytics(api?.analytics?.actions)(INPUT_METHOD.TABLE_CONTEXT_MENU, {
			index,
			moveCursorToInsertedRow: true,
		})(editorView.state, editorView.dispatch);
		api?.core.actions.execute(closeActiveTableMenu(api));
		api?.core.actions.focus();
	};

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			elemBefore={<TableRowAddAboveIcon color="currentColor" label="" size="small" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut={tooltip(addRowBefore) ?? ''} />}
		>
			{formatMessage(messages.addRowAbove)}
		</ToolbarDropdownItem>
	);
};
