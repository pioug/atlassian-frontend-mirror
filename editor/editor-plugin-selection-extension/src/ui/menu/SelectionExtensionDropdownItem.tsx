import React, { createElement } from 'react';

import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';

import type { ExtensionDropdownItemConfiguration } from '../../types';

type SelectionExtensionDropdownItemProps = {
	dropdownItem: ExtensionDropdownItemConfiguration;
};

export const SelectionExtensionDropdownItem = ({
	dropdownItem,
}: SelectionExtensionDropdownItemProps) => {
	return (
		<ToolbarDropdownItem
			elemBefore={dropdownItem.icon ? createElement(dropdownItem.icon, { label: '' }) : undefined}
			onClick={dropdownItem.onClick}
			isDisabled={dropdownItem.isDisabled}
		>
			{dropdownItem.label}
		</ToolbarDropdownItem>
	);
};
