import React from 'react';

import { useIntl } from 'react-intl';

import { TableSortOrder as SortOrder } from '@atlaskit/custom-steps';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { getSelectionRect } from '@atlaskit/editor-tables/utils';
import { SortAscendingIcon, ToolbarDropdownItem } from '@atlaskit/editor-toolbar';

import { closeActiveTableMenu } from '../../../../pm-plugins/commands';
import { sortColumnWithAnalytics } from '../../../../pm-plugins/commands/commands-with-analytics';
import { useTableMenuContext } from '../../shared/TableMenuContext';
import type { TableMenuComponentsParams } from '../../shared/types';

export const SortIncreasingItem = ({ api }: TableMenuComponentsParams): React.JSX.Element => {
	const tableMenuContext = useTableMenuContext();
	const { editorView } = tableMenuContext ?? {};
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
		api?.core.actions.execute(closeActiveTableMenu(api));
		api?.core.actions.focus();
	};

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			isDisabled={Boolean(tableMenuContext?.hasMergedCellsInTable)}
			elemBefore={<SortAscendingIcon label="" size="small" />}
		>
			{formatMessage(messages.sortColumnIncreasing)}
		</ToolbarDropdownItem>
	);
};
