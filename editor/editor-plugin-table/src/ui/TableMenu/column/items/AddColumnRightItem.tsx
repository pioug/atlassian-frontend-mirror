import React from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { addColumnAfter, tooltip } from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { getSelectionRect } from '@atlaskit/editor-tables/utils';
import {
	TableColumnAddRightIcon,
	ToolbarDropdownItem,
	ToolbarKeyboardShortcutHint,
} from '@atlaskit/editor-toolbar';

import { closeActiveTableMenu } from '../../../../pm-plugins/commands';
import { insertColumnWithAnalytics } from '../../../../pm-plugins/commands/commands-with-analytics';
import type { TableSharedStateInternal } from '../../../../types';
import { useTableMenuContext } from '../../shared/TableMenuContext';
import type { TableMenuComponentsParams } from '../../shared/types';

export const AddColumnRightItem = ({ api }: TableMenuComponentsParams): React.JSX.Element => {
	const { editorView } = useTableMenuContext() ?? {};
	const { formatMessage } = useIntl();
	const { isCommentEditor, isTableFixedColumnWidthsOptionEnabled, isTableScalingEnabled } =
		useSharedPluginStateWithSelector(api ?? undefined, ['table'], (states) => {
			const tableState = states.tableState as TableSharedStateInternal | undefined;
			return {
				isCommentEditor: tableState?.isCommentEditor,
				isTableFixedColumnWidthsOptionEnabled: tableState?.isTableFixedColumnWidthsOptionEnabled,
				isTableScalingEnabled: tableState?.isTableScalingEnabled,
			};
		});

	const handleClick = () => {
		if (!editorView) {
			return;
		}

		const selectionRect = getSelectionRect(editorView.state.selection);
		const index = selectionRect?.right;
		if (index === undefined) {
			return;
		}

		const shouldUseIncreasedScalingPercent =
			isTableScalingEnabled && (isTableFixedColumnWidthsOptionEnabled || isCommentEditor);

		insertColumnWithAnalytics(
			api,
			api?.analytics?.actions,
			isTableScalingEnabled,
			isTableFixedColumnWidthsOptionEnabled,
			shouldUseIncreasedScalingPercent,
			isCommentEditor,
		)(INPUT_METHOD.TABLE_CONTEXT_MENU, index)(editorView.state, editorView.dispatch, editorView);
		api?.core.actions.execute(closeActiveTableMenu());
		api?.core.actions.focus();
	};

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			elemBefore={<TableColumnAddRightIcon color="currentColor" label="" size="small" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut={tooltip(addColumnAfter) ?? ''} />}
		>
			{formatMessage(messages.addColumnRight)}
		</ToolbarDropdownItem>
	);
};
