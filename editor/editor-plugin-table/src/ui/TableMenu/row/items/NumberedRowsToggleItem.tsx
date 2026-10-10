import React from 'react';

import { useIntl } from 'react-intl';

import { messages } from '@atlaskit/editor-common/messages/table';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar/toolbar-dropdown-item';
import Toggle from '@atlaskit/toggle';

import { toggleNumberColumnWithAnalytics } from '../../../../pm-plugins/commands/commands-with-analytics';
import type { TableSharedStateInternal } from '../../../../types';
import { useTableMenuContext } from '../../shared/TableMenuContext';
import type { TableMenuComponentsParams } from '../../shared/types';

export const NumberedRowsToggleItem = (
	props: TableMenuComponentsParams,
): React.JSX.Element | null => {
	const { api } = props;
	const { editorView } = useTableMenuContext() ?? {};
	const { isNumberColumnAllowed, isNumberColumnEnabled } = useSharedPluginStateWithSelector(
		api ?? undefined,
		['table'],
		(states) => ({
			isNumberColumnAllowed: (states.tableState as TableSharedStateInternal | undefined)
				?.pluginConfig?.allowNumberColumn,
			isNumberColumnEnabled: (states.tableState as TableSharedStateInternal | undefined)
				?.isNumberColumnEnabled,
		}),
	);
	const { formatMessage } = useIntl();
	const label = formatMessage(messages.numberedRows);

	const handleClick = () => {
		if (!editorView) {
			return;
		}
		toggleNumberColumnWithAnalytics(api?.analytics?.actions)(editorView.state, editorView.dispatch);
	};

	if (!isNumberColumnAllowed) {
		return null;
	}

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			elemAfter={
				<Toggle label={label} isChecked={!!isNumberColumnEnabled} onChange={handleClick} />
			}
		>
			{label}
		</ToolbarDropdownItem>
	);
};
