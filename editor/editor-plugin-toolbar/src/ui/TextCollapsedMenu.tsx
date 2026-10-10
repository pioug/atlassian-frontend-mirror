import React from 'react';

import { useIntl } from 'react-intl';

import { toolbarMessages } from '@atlaskit/editor-common/messages/toolbar';
import { TextIcon } from '@atlaskit/editor-toolbar/text-icon';
import { ToolbarDropdownMenu } from '@atlaskit/editor-toolbar/toolbar-dropdown-menu';
import { ToolbarTooltip } from '@atlaskit/editor-toolbar/toolbar-tooltip';

type TextStylesMenuButtonProps = {
	children: React.ReactNode;
};

/**
 * Basic version of existing 'Text Styles' Menu - which doesn't dynamically change icon
 * and is also placeholder to render all other menus in the collapsed state.
 */
export const TextCollapsedMenu = ({ children }: TextStylesMenuButtonProps): React.JSX.Element => {
	const { formatMessage } = useIntl();

	return (
		<ToolbarDropdownMenu
			iconBefore={
				<TextIcon label={formatMessage(toolbarMessages.textStylesTooltip)} size="small" />
			}
			enableMaxHeight
			tooltipComponent={
				<ToolbarTooltip content={formatMessage(toolbarMessages.textStylesTooltip)} />
			}
		>
			{children}
		</ToolbarDropdownMenu>
	);
};
