import React from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { TableCellMergeIcon, ToolbarDropdownItem } from '@atlaskit/editor-toolbar';

import { closeActiveTableMenu } from '../../../../pm-plugins/commands';
import { mergeCellsWithAnalytics } from '../../../../pm-plugins/commands/commands-with-analytics';
import { useTableMenuContext, type TableMenuContextValue } from '../../shared/TableMenuContext';
import type { TableMenuComponentsParams } from '../../shared/types';

/**
 * Merge cells is only visible when the active selection can actually be merged
 * (multi-cell, non-overlapping).
 */
const shouldShowMergeCells = (tableMenuContext?: TableMenuContextValue): boolean =>
	tableMenuContext?.canMergeCells === true;

export const MergeCellsItem = ({ api }: TableMenuComponentsParams): React.JSX.Element | null => {
	const tableMenuContext = useTableMenuContext();
	const { editorView } = tableMenuContext ?? {};
	const { formatMessage } = useIntl();

	const handleClick = () => {
		if (!editorView) {
			return;
		}

		mergeCellsWithAnalytics(api?.analytics?.actions)(INPUT_METHOD.CONTEXT_MENU)(
			editorView.state,
			editorView.dispatch,
		);
		api?.core.actions.execute(closeActiveTableMenu(api));
		api?.core.actions.focus();
	};

	if (!shouldShowMergeCells(tableMenuContext)) {
		return null;
	}

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			elemBefore={<TableCellMergeIcon label="" size="small" />}
		>
			{formatMessage(messages.mergeCells)}
		</ToolbarDropdownItem>
	);
};
