import React from 'react';

import { useIntl } from 'react-intl';

import { TableSortOrder as SortOrder } from '@atlaskit/custom-steps';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import { getSelectionRect } from '@atlaskit/editor-tables/utils';
import { ArrowUpIcon, ToolbarDropdownItem } from '@atlaskit/editor-toolbar';

import { sortColumnWithAnalytics } from '../../../../pm-plugins/commands/commands-with-analytics';
import { useTableMenuContext } from '../../shared/TableMenuContext';
import type { TableMenuComponentsParams } from '../../shared/types';

export const SortIncreasingItem = ({ api }: TableMenuComponentsParams): React.JSX.Element => {
	const { editorView } = useEditorToolbar();
	const tableMenuContext = useTableMenuContext();
	const { formatMessage } = useIntl();

	const handleClick = () => {
		if (!editorView) {
			return;
		}
		const selectionRect = getSelectionRect(editorView.state.selection);
		const columnIndex = selectionRect?.left;
		if (columnIndex === undefined) {
			return;
		}
		sortColumnWithAnalytics(api?.analytics?.actions)(
			INPUT_METHOD.TABLE_CONTEXT_MENU,
			columnIndex,
			SortOrder.ASC,
		)(editorView.state, editorView.dispatch);
	};

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			isDisabled={Boolean(tableMenuContext?.hasMergedCellsInTable)}
			elemBefore={<ArrowUpIcon color="currentColor" label="" size="small" />}
		>
			{formatMessage(messages.sortColumnIncreasing)}
		</ToolbarDropdownItem>
	);
};
