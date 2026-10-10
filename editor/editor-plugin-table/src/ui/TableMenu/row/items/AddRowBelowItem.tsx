import React from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import { addRowAfter, tooltip } from '@atlaskit/editor-common/keymaps';
import { messages } from '@atlaskit/editor-common/messages/table';
import { TableRowAddBelowIcon } from '@atlaskit/editor-toolbar/row-add-below-icon';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar/toolbar-dropdown-item';
import { ToolbarKeyboardShortcutHint } from '@atlaskit/editor-toolbar/toolbar-keyboard-shortcut-hint';

import { closeActiveTableMenu } from '../../../../pm-plugins/commands';
import { insertRowWithAnalytics } from '../../../../pm-plugins/commands/commands-with-analytics';
import { getMenuSelectionRect } from '../../shared/selection';
import { useTableMenuContext } from '../../shared/TableMenuContext';
import type { TableMenuComponentsParams } from '../../shared/types';

export const AddRowBelowItem = (props: TableMenuComponentsParams): React.JSX.Element => {
	const { api } = props;
	const { editorView } = useTableMenuContext() ?? {};
	const { formatMessage } = useIntl();

	const handleClick = () => {
		if (!editorView) {
			return;
		}

		const selectionRect = getMenuSelectionRect(editorView.state.selection);
		const index = selectionRect?.bottom;
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
			elemBefore={<TableRowAddBelowIcon color="currentColor" label="" size="small" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut={tooltip(addRowAfter) ?? ''} />}
		>
			{formatMessage(messages.addRowBelow)}
		</ToolbarDropdownItem>
	);
};
