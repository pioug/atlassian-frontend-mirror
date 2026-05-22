import React from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { addColumnBefore, tooltip } from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import { getSelectionRect } from '@atlaskit/editor-tables/utils';
import {
	TableColumnAddLeftIcon,
	ToolbarDropdownItem,
	ToolbarKeyboardShortcutHint,
} from '@atlaskit/editor-toolbar';

import { insertColumnWithAnalytics } from '../../../../pm-plugins/commands/commands-with-analytics';
import type { TableSharedStateInternal } from '../../../../types';
import type { TableMenuComponentsParams } from '../../shared/types';

export const AddColumnLeftItem = ({ api }: TableMenuComponentsParams): React.JSX.Element => {
	const { editorView } = useEditorToolbar();
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
		const index = selectionRect?.left;
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
	};

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			elemBefore={<TableColumnAddLeftIcon color="currentColor" label="" size="small" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut={tooltip(addColumnBefore) ?? ''} />}
		>
			{formatMessage(messages.addColumnLeft)}
		</ToolbarDropdownItem>
	);
};
