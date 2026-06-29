/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@compiled/react';
import { useIntl } from 'react-intl';

import { TableSortOrder as SortOrder } from '@atlaskit/custom-steps';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { getSelectionRect } from '@atlaskit/editor-tables/utils';
import {
	InformationCircleIcon,
	SortDescendingIcon,
	ToolbarDropdownItem,
} from '@atlaskit/editor-toolbar';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { closeActiveTableMenu } from '../../../../pm-plugins/commands';
import { sortColumnWithAnalytics } from '../../../../pm-plugins/commands/commands-with-analytics';
import { useTableMenuContext } from '../../shared/TableMenuContext';
import type { TableMenuComponentsParams } from '../../shared/types';

const styles = cssMap({
	// Mimics the disabled text appearance while keeping the menu item interactive.
	disabledLabel: {
		color: token('color.text.disabled'),
	},
	// Wrapper around the info icon so it provides a stable tooltip trigger and
	// a comfortable hover target.
	infoIconTrigger: {
		display: 'inline-flex',
		alignItems: 'center',
	},
});

export const SortDecreasingItem = ({ api }: TableMenuComponentsParams): React.JSX.Element => {
	const tableMenuContext = useTableMenuContext();
	const { editorView } = tableMenuContext ?? {};
	const { formatMessage } = useIntl();
	const hasMergedCellsInTable = Boolean(tableMenuContext?.hasMergedCellsInTable);

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
			SortOrder.DESC,
		)(editorView.state, editorView.dispatch);
		api?.core.actions.execute(closeActiveTableMenu(api));
		api?.core.actions.focus();
	};

	// When the table has merged cells, the item remains interactive but is rendered
	// with a disabled-looking label and leading icon, alongside an enabled info icon
	// that surfaces why sorting is unavailable.
	if (hasMergedCellsInTable && fg('platform_editor_table_menu_updates_patch_1')) {
		return (
			<ToolbarDropdownItem
				elemBefore={
					<SortDescendingIcon label="" size="small" color={token('color.text.disabled')} />
				}
				elemAfter={
					<Tooltip content={formatMessage(messages.canNotSortTableNoIcon)} position="top">
						{(tooltipProps) => (
							// Ignored via go/ees005
							// eslint-disable-next-line react/jsx-props-no-spreading
							<Box as="span" xcss={styles.infoIconTrigger} {...tooltipProps}>
								<InformationCircleIcon label="" size="small" color={token('color.icon')} />
							</Box>
						)}
					</Tooltip>
				}
			>
				<Box as="span" xcss={styles.disabledLabel}>
					{formatMessage(messages.sortColumnDecreasing)}
				</Box>
			</ToolbarDropdownItem>
		);
	}

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			isDisabled={Boolean(tableMenuContext?.hasMergedCellsInTable)}
			elemBefore={<SortDescendingIcon label="" size="small" />}
		>
			{formatMessage(messages.sortColumnDecreasing)}
		</ToolbarDropdownItem>
	);
};
