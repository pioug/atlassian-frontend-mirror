import React from 'react';

import type { ExtensionMenuItemConfiguration } from '../../types';
import { isNestedDropdownMenuConfiguration } from '../utils/menu-items';

import { SelectionExtensionDropdownItem } from './SelectionExtensionDropdownItem';
import { SelectionExtensionNestedDropdownMenu } from './SelectionExtensionNestedDropdownMenu';

type SelectionExtensionMenuItemsProps = {
	getMenuItems: () => ExtensionMenuItemConfiguration[];
};

export const SelectionExtensionMenuItems = ({
	getMenuItems,
}: SelectionExtensionMenuItemsProps): React.JSX.Element | null => {
	const extensionMenuItems = getMenuItems();

	if (!extensionMenuItems?.length) {
		return null;
	}

	return (
		<>
			{extensionMenuItems.map((item) => {
				if (isNestedDropdownMenuConfiguration(item)) {
					return (
						<SelectionExtensionNestedDropdownMenu
							key={item.key || item.label}
							nestedDropdownMenu={item}
						/>
					);
				}

				return <SelectionExtensionDropdownItem key={item.key || item.label} dropdownItem={item} />;
			})}
		</>
	);
};
