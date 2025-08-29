import React from 'react';

import { useIntl } from 'react-intl-next';

import { toolbarMessages } from '@atlaskit/editor-common/messages';
import { ToolbarDropdownMenu, ToolbarTooltip, TextIcon } from '@atlaskit/editor-toolbar';

type TextStylesMenuButtonProps = {
	children: React.ReactNode;
};

/**
 * Basic version of existing 'Text Styles' Menu - which doesn't dynamically change icon
 * and is also placeholder to render all other menus in the collapsed state.
 */
export const TextCollapsedMenu = ({ children }: TextStylesMenuButtonProps) => {
	const { formatMessage } = useIntl();

	return (
		<ToolbarTooltip content={formatMessage(toolbarMessages.textStylesTooltip)}>
			<ToolbarDropdownMenu
				iconBefore={
					<TextIcon label={formatMessage(toolbarMessages.textStylesTooltip)} size="small" />
				}
				enableMaxHeight
			>
				{children}
			</ToolbarDropdownMenu>
		</ToolbarTooltip>
	);
};
