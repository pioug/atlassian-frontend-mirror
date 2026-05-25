import React from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { TableCellSplitIcon, ToolbarDropdownItem } from '@atlaskit/editor-toolbar';

import { closeActiveTableMenu } from '../../../../pm-plugins/commands';
import { splitCellWithAnalytics } from '../../../../pm-plugins/commands/commands-with-analytics';
import {
	useTableMenuContext,
	type TableMenuContextValue,
} from '../../shared/TableMenuContext';
import type { TableMenuComponentsParams } from '../../shared/types';

/**
 * Split cell is only visible when the active selection sits in a cell whose
 * `rowspan` or `colspan` is greater than one.
 */
const shouldShowSplitCell = (tableMenuContext?: TableMenuContextValue): boolean =>
	tableMenuContext?.canSplitCell === true;

export const SplitCellItem = ({ api }: TableMenuComponentsParams): React.JSX.Element | null => {
	const tableMenuContext = useTableMenuContext();
	const { editorView } = tableMenuContext ?? {};
	const { formatMessage } = useIntl();

	const handleClick = () => {
		if (!editorView) {
			return;
		}

		splitCellWithAnalytics(api?.analytics?.actions)(INPUT_METHOD.CONTEXT_MENU)(
			editorView.state,
			editorView.dispatch,
		);
		closeActiveTableMenu()(editorView.state, editorView.dispatch);
	};

	if (!shouldShowSplitCell(tableMenuContext)) {
		return null;
	}

	return (
		<ToolbarDropdownItem onClick={handleClick} elemBefore={<TableCellSplitIcon label="" size="small" />}>
			{formatMessage(messages.splitCell)}
		</ToolbarDropdownItem>
	);
};
