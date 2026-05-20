import React from 'react';

import { useIntl } from 'react-intl';

import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import Toggle from '@atlaskit/toggle';

import {
	type TableMenuContextValue,
	useTableMenuContext,
} from '../../shared/TableMenuContext';

/** Header row toggle is only visible when the first row is the entire selection. */
const shouldShowHeaderRowToggle = (tableMenuContext?: TableMenuContextValue): boolean =>
	tableMenuContext?.isFirstRow === true && tableMenuContext.selectedRowCount === 1;

export const HeaderRowToggleItem = (): React.JSX.Element | null => {
	const tableMenuContext = useTableMenuContext();
	const { formatMessage } = useIntl();
	const label = formatMessage(messages.headerRow);

	if (!shouldShowHeaderRowToggle(tableMenuContext)) {
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
