import React from 'react';

import { useIntl } from 'react-intl';

import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import Toggle from '@atlaskit/toggle';

import {
	useTableMenuContext,
	type TableMenuContextValue,
} from '../../shared/TableMenuContext';

/**
 * Header column toggle is only visible when the first column is the entire
 * selection.
 *
 * Exported so `ColumnToggleSection` (which can become empty) and
 * `ColumnBackgroundSection` (which drops its leading separator alongside)
 * can stay in lockstep with this rule without redefining it.
 */
export const shouldShowHeaderColumnToggle = (
	tableMenuContext?: TableMenuContextValue,
): boolean =>
	tableMenuContext?.isFirstColumn === true && tableMenuContext.selectedColumnCount === 1;

export const HeaderColumnToggleItem = (): React.JSX.Element | null => {
	const tableMenuContext = useTableMenuContext();
	const { formatMessage } = useIntl();
	const label = formatMessage(messages.headerColumn);

	if (!shouldShowHeaderColumnToggle(tableMenuContext)) {
		return null;
	}

	return (
		<ToolbarDropdownItem
			elemAfter={
				<Toggle label={label} isChecked={false} />
			}
		>
			{label}
		</ToolbarDropdownItem>
	);
};
