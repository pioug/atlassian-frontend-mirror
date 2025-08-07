import React from 'react';

import { useIntl } from 'react-intl-next';

import { toolbarMessages } from '@atlaskit/editor-common/messages';
import {
	ShowMoreHorizontalIcon,
	ToolbarDropdownMenu,
	ToolbarTooltip,
} from '@atlaskit/editor-toolbar';

export const OverflowMenu = ({ children }: { children: React.ReactNode }) => {
	const intl = useIntl();

	const tooltipContent = intl.formatMessage(toolbarMessages.selectionToolbarOverflowMenuTooltip);
	return (
		<ToolbarTooltip content={tooltipContent} position="top">
			<ToolbarDropdownMenu label={tooltipContent} iconBefore={<ShowMoreHorizontalIcon label="" />}>
				{children}
			</ToolbarDropdownMenu>
		</ToolbarTooltip>
	);
};
