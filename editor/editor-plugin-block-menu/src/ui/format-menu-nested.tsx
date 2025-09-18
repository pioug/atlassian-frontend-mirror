import React from 'react';

import { useIntl } from 'react-intl-next';

import { messages } from '@atlaskit/editor-common/block-menu';
import { ToolbarNestedDropdownMenu } from '@atlaskit/editor-toolbar';
import ChangesIcon from '@atlaskit/icon/core/changes';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';

export const FormatMenuComponent = ({ children }: { children: React.ReactNode }) => {
	const { formatMessage } = useIntl();

	return (
		<ToolbarNestedDropdownMenu
			text={formatMessage(messages.turnInto)}
			elemBefore={<ChangesIcon label="" />}
			elemAfter={<ChevronRightIcon label="" />}
			enableMaxHeight={true}
		>
			{children}
		</ToolbarNestedDropdownMenu>
	);
};
