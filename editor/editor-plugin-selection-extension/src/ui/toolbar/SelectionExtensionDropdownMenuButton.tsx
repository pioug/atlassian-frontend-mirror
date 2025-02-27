import React from 'react';

import { injectIntl } from 'react-intl-next';
import type { WrappedComponentProps } from 'react-intl-next';

import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import AppsIcon from '@atlaskit/icon/core/apps';

type SelectionExtensionDropdownMenuButtonProps = React.ComponentProps<typeof ToolbarButton> &
	WrappedComponentProps;
const SelectionExtensionDropdownMenuButtonComponent = ({
	onClick,
}: SelectionExtensionDropdownMenuButtonProps) => {
	return (
		<ToolbarButton testId="selection-extension-dropdown-button" onClick={onClick}>
			<AppsIcon label="selection extension dropdown" />
		</ToolbarButton>
	);
};

export const SelectionExtensionDropdownMenuButton = injectIntl(
	SelectionExtensionDropdownMenuButtonComponent,
);
