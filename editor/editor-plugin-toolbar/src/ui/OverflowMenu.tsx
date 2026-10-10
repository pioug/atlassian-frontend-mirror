import React from 'react';

import { useIntl } from 'react-intl';

import { toolbarMessages } from '@atlaskit/editor-common/messages/toolbar';
import { ShowMoreHorizontalIcon } from '@atlaskit/editor-toolbar/show-more-horizontal';
import { ToolbarDropdownMenu } from '@atlaskit/editor-toolbar/toolbar-dropdown-menu';
import { ToolbarTooltip } from '@atlaskit/editor-toolbar/toolbar-tooltip';

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
