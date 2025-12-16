import React from 'react';

import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';

import type { ExtensionDropdownItemConfiguration } from '../../types';

type SelectionExtensionDropdownItemProps = {
	dropdownItem: ExtensionDropdownItemConfiguration;
};

export const SelectionExtensionDropdownItem = ({
	dropdownItem,
}: SelectionExtensionDropdownItemProps): React.JSX.Element => {
	const IconComponent = dropdownItem.icon;
	return (
		<ToolbarDropdownItem
			elemBefore={IconComponent ? <IconComponent label="" /> : undefined}
			onClick={dropdownItem.onClick}
			isDisabled={dropdownItem.isDisabled}
		>
			{dropdownItem.label}
		</ToolbarDropdownItem>
	);
};
