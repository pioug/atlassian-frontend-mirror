import React from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import { getSelectionRect } from '@atlaskit/editor-tables/utils';
import { TableColumnsDistributeIcon, ToolbarDropdownItem } from '@atlaskit/editor-toolbar';

import { distributeColumnsWidthsWithAnalytics } from '../../../../pm-plugins/commands/commands-with-analytics';
import { getNewResizeStateFromSelectedColumns } from '../../../../pm-plugins/table-resizing/utils/resize-state';
import type { TableSharedStateInternal } from '../../../../types';
import { useTableMenuContext } from '../../shared/TableMenuContext';
import type { TableMenuComponentsParams } from '../../shared/types';

/** Distribute columns is only visible when more than one column is selected. */
const shouldShowDistributeColumns = (selectedColumnCount?: number): boolean =>
	(selectedColumnCount ?? 0) > 1;

export const DistributeColumnsItem = ({
	api,
}: TableMenuComponentsParams): React.JSX.Element | null => {
	const { editorView } = useEditorToolbar();
	const tableMenuContext = useTableMenuContext();
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
		const editorContainerWidth = api?.width?.sharedState.currentState();
		if (!selectionRect || !editorContainerWidth) {
			return;
		}

		const newResizeState = getNewResizeStateFromSelectedColumns(
			selectionRect,
			editorView.state,
			editorView.domAtPos.bind(editorView),
			() => editorContainerWidth,
			isTableScalingEnabled,
			isTableFixedColumnWidthsOptionEnabled,
			isCommentEditor,
		);

		if (!newResizeState) {
			return;
		}

		distributeColumnsWidthsWithAnalytics(api?.analytics?.actions, api)(
			INPUT_METHOD.TABLE_CONTEXT_MENU,
			newResizeState,
		)(editorView.state, editorView.dispatch);
	};

	if (!shouldShowDistributeColumns(tableMenuContext?.selectedColumnCount)) {
		return null;
	}

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			elemBefore={<TableColumnsDistributeIcon color="currentColor" label="" size="small" />}
		>
			{formatMessage(messages.distributeColumns)}
		</ToolbarDropdownItem>
	);
};
