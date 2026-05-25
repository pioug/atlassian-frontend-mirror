import React from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { deleteColumn, tooltip } from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { getSelectionRect } from '@atlaskit/editor-tables/utils';
import {
	DeleteIcon,
	ToolbarDropdownItem,
	ToolbarKeyboardShortcutHint,
} from '@atlaskit/editor-toolbar';

import { clearHoverSelection, hoverColumns } from '../../../../pm-plugins/commands';
import { deleteColumnsWithAnalytics } from '../../../../pm-plugins/commands/commands-with-analytics';
import { getSelectedColumnIndexes } from '../../../../pm-plugins/utils/selection';
import type { TableSharedStateInternal } from '../../../../types';
import { useTableMenuContext } from '../../shared/TableMenuContext';
import type { TableMenuComponentsParams } from '../../shared/types';

export const DeleteColumnItem = ({ api }: TableMenuComponentsParams): React.JSX.Element => {
	const tableMenuContext = useTableMenuContext();
	const { editorView } = tableMenuContext ?? {};
	const selectedColumnCount = tableMenuContext?.selectedColumnCount ?? 1;
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

	const handleMouseEnter = () => {
		if (!editorView) {
			return;
		}

		const selectionRect = getSelectionRect(editorView.state.selection);
		if (!selectionRect) {
			return;
		}

		hoverColumns(getSelectedColumnIndexes(selectionRect), true)(
			editorView.state,
			editorView.dispatch,
		);
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

		const shouldUseIncreasedScalingPercent =
			isTableScalingEnabled && (isTableFixedColumnWidthsOptionEnabled || isCommentEditor);

		deleteColumnsWithAnalytics(
			api?.analytics?.actions,
			api,
			isTableScalingEnabled,
			isTableFixedColumnWidthsOptionEnabled,
			shouldUseIncreasedScalingPercent,
			isCommentEditor,
		)(INPUT_METHOD.TABLE_CONTEXT_MENU, selectionRect)(
			editorView.state,
			editorView.dispatch,
			editorView,
		);
	};

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			onFocus={handleMouseEnter}
			onMouseEnter={handleMouseEnter}
			onBlur={handleMouseLeave}
			onMouseLeave={handleMouseLeave}
			elemBefore={<DeleteIcon color="currentColor" label="" size="small" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut={tooltip(deleteColumn) ?? ''} />}
		>
			{formatMessage(messages.removeColumns, { 0: selectedColumnCount })}
		</ToolbarDropdownItem>
	);
};
