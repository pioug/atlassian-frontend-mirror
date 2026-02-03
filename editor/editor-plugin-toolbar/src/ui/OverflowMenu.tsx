import React from 'react';

import { useIntl } from 'react-intl-next';

import { toolbarMessages } from '@atlaskit/editor-common/messages';
import {
	ShowMoreHorizontalIcon,
	ToolbarDropdownMenu,
	ToolbarTooltip,
} from '@atlaskit/editor-toolbar';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

export const OverflowMenu = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
	const intl = useIntl();

	const tooltipContent = intl.formatMessage(toolbarMessages.selectionToolbarOverflowMenuTooltip);

	if (expValEquals('platform_editor_hide_toolbar_tooltips_fix', 'isEnabled', true)) {
		return (
			<ToolbarDropdownMenu
				label={tooltipContent}
				iconBefore={<ShowMoreHorizontalIcon label="" />}
				tooltipComponent={<ToolbarTooltip content={tooltipContent} position="top"/>}
			>
				{children}
			</ToolbarDropdownMenu>
		);
	}

	return (
		<ToolbarTooltip content={tooltipContent} position="top">
			<ToolbarDropdownMenu label={tooltipContent} iconBefore={<ShowMoreHorizontalIcon label="" />}>
				{children}
			</ToolbarDropdownMenu>
		</ToolbarTooltip>
	);
};
