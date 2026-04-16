import React from 'react';

import { useIntl } from 'react-intl';

import { toolbarMessages } from '@atlaskit/editor-common/messages';
import {
	ShowMoreHorizontalIcon,
	ToolbarDropdownMenu,
	ToolbarTooltip,
} from '@atlaskit/editor-toolbar';

export const OverflowMenu = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
	const intl = useIntl();

	const tooltipContent = intl.formatMessage(toolbarMessages.selectionToolbarOverflowMenuTooltip);

	return (
		<ToolbarDropdownMenu
			label={tooltipContent}
			iconBefore={<ShowMoreHorizontalIcon label="" />}
			tooltipComponent={<ToolbarTooltip content={tooltipContent} position="top" />}
		>
			{children}
		</ToolbarDropdownMenu>
	);
};
