import React from 'react';

import { useIntl } from 'react-intl';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import Toggle from '@atlaskit/toggle';

import { toggleHeaderRowWithAnalytics } from '../../../../pm-plugins/commands/commands-with-analytics';
import type { TableSharedStateInternal } from '../../../../types';
import { useTableMenuContext } from '../../shared/TableMenuContext';
import type { TableMenuComponentsParams } from '../../shared/types';

/** Header row toggle is only visible when the first row is the entire selection. */
const shouldShowHeaderRowToggle = ({
	isFirstRow,
	isHeaderRowAllowed,
	selectedRowCount,
}: {
	isFirstRow: boolean;
	isHeaderRowAllowed?: boolean;
	selectedRowCount: number;
}): boolean => isHeaderRowAllowed === true && isFirstRow && selectedRowCount === 1;

export const HeaderRowToggleItem = (props: TableMenuComponentsParams): React.JSX.Element | null => {
	const { api } = props;
	const { editorView } = useEditorToolbar();
	const tableMenuContext = useTableMenuContext();
	const { isHeaderRowAllowed, isHeaderRowEnabled } = useSharedPluginStateWithSelector(
		api ?? undefined,
		['table'],
		(states) => ({
			isHeaderRowAllowed: (states.tableState as TableSharedStateInternal | undefined)
				?.pluginConfig?.allowHeaderRow,
			isHeaderRowEnabled: (states.tableState as TableSharedStateInternal | undefined)
				?.isHeaderRowEnabled,
		}),
	);
	const selectedRowCount = tableMenuContext?.selectedRowCount ?? 0;
	const { formatMessage } = useIntl();
	const label = formatMessage(messages.headerRow);

	const handleClick = () => {
		if (!editorView) {
			return;
		}
		toggleHeaderRowWithAnalytics(api?.analytics?.actions)(editorView.state, editorView.dispatch);
	};

	if (!shouldShowHeaderRowToggle({ isFirstRow: tableMenuContext?.isFirstRow === true, isHeaderRowAllowed, selectedRowCount })) {
		return null;
	}

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			elemAfter={
				<Toggle label={label} isChecked={!!isHeaderRowEnabled} onChange={handleClick} />
			}
		>
			{label}
		</ToolbarDropdownItem>
	);
};
