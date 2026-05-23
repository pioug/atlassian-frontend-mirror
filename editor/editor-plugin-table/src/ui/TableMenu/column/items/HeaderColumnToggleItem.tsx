import React from 'react';

import { useIntl } from 'react-intl';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import Toggle from '@atlaskit/toggle';

import { toggleHeaderColumnWithAnalytics } from '../../../../pm-plugins/commands/commands-with-analytics';
import type { TableSharedStateInternal } from '../../../../types';
import { useTableMenuContext } from '../../shared/TableMenuContext';
import type { TableMenuComponentsParams } from '../../shared/types';

/**
 * Header column toggle is only visible when the first column is the entire
 * selection.
 *
 * Exported so `ColumnToggleSection` (which can become empty) and
 * `ColumnBackgroundSection` (which drops its leading separator alongside)
 * can stay in lockstep with this rule without redefining it.
 */
export const shouldShowHeaderColumnToggle = ({
	isFirstColumn,
	isHeaderColumnAllowed,
	selectedColumnCount,
}: {
	isFirstColumn?: boolean;
	isHeaderColumnAllowed?: boolean;
	selectedColumnCount?: number;
}): boolean =>
	isHeaderColumnAllowed === true && isFirstColumn === true && selectedColumnCount === 1;

export const HeaderColumnToggleItem = (
	props: TableMenuComponentsParams,
): React.JSX.Element | null => {
	const { api } = props;
	const { editorView } = useEditorToolbar();
	const tableMenuContext = useTableMenuContext();
	const { isHeaderColumnAllowed, isHeaderColumnEnabled } = useSharedPluginStateWithSelector(
		api ?? undefined,
		['table'],
		(states) => ({
			isHeaderColumnAllowed: (states.tableState as TableSharedStateInternal | undefined)
				?.pluginConfig?.allowHeaderColumn,
			isHeaderColumnEnabled: (states.tableState as TableSharedStateInternal | undefined)
				?.isHeaderColumnEnabled,
		}),
	);
	const { formatMessage } = useIntl();
	const label = formatMessage(messages.headerColumn);

	const handleClick = () => {
		if (!editorView) {
			return;
		}
		toggleHeaderColumnWithAnalytics(api?.analytics?.actions)(editorView.state, editorView.dispatch);
	};

	if (
		!shouldShowHeaderColumnToggle({
			isFirstColumn: tableMenuContext?.isFirstColumn,
			isHeaderColumnAllowed,
			selectedColumnCount: tableMenuContext?.selectedColumnCount,
		})
	) {
		return null;
	}

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			elemAfter={
				<Toggle label={label} isChecked={!!isHeaderColumnEnabled} onChange={handleClick} />
			}
		>
			{label}
		</ToolbarDropdownItem>
	);
};
