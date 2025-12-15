import React from 'react';

import { ToolbarDropdownItemSection, ToolbarNestedDropdownMenu } from '@atlaskit/editor-toolbar';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';

import { type ExtensionNestedDropdownMenuConfiguration } from '../../types';

import { SelectionExtensionDropdownItem } from './SelectionExtensionDropdownItem';

export type SelectionExtensionNestedDropdownMenuProps = {
	nestedDropdownMenu: ExtensionNestedDropdownMenuConfiguration;
};

const ChildItems = ({ nestedDropdownMenu }: SelectionExtensionNestedDropdownMenuProps) => {
	const childItems = nestedDropdownMenu.getMenuItems();

	return (
		<ToolbarDropdownItemSection>
			{childItems.map((dropdownItem) => (
				<SelectionExtensionDropdownItem key={dropdownItem.label} dropdownItem={dropdownItem} />
			))}
		</ToolbarDropdownItemSection>
	);
};

export const SelectionExtensionNestedDropdownMenu = ({
	nestedDropdownMenu,
}: SelectionExtensionNestedDropdownMenuProps) => {
	const IconComponent = nestedDropdownMenu.icon;
	return (
		<ToolbarNestedDropdownMenu
			text={nestedDropdownMenu.label}
			elemBefore={IconComponent ? <IconComponent label="" /> : undefined}
			elemAfter={<ChevronRightIcon label={'nested menu'} />}
		>
			<ChildItems nestedDropdownMenu={nestedDropdownMenu} />
		</ToolbarNestedDropdownMenu>
	);
};
