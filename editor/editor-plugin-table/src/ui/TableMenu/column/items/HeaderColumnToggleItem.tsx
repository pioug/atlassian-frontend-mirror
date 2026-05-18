import React from 'react';

import { useIntl } from 'react-intl';

import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import Toggle from '@atlaskit/toggle';

export const HeaderColumnToggleItem = (): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const label = formatMessage(messages.headerColumn);

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
