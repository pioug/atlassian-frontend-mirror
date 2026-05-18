import React from 'react';

import { useIntl } from 'react-intl';

import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import Toggle from '@atlaskit/toggle';

export const NumberedRowsToggleItem = (): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const label = formatMessage(messages.numberedRows);

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
