import React, { createElement } from 'react';

import { ToolbarNestedDropdownMenu } from '@atlaskit/editor-toolbar';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';

import { type ExtensionNestedDropdownMenuConfiguration } from '../../types';

import { SelectionExtensionDropdownItem } from './SelectionExtensionDropdownItem';

export type SelectionExtensionNestedDropdownMenuProps = {
	nestedDropdownMenu: ExtensionNestedDropdownMenuConfiguration;
};

const ChildItems = ({ nestedDropdownMenu }: SelectionExtensionNestedDropdownMenuProps) => {
	const childItems = nestedDropdownMenu.getMenuItems();

	return (
		<>
			{childItems.map((dropdownItem) => (
				<SelectionExtensionDropdownItem key={dropdownItem.label} dropdownItem={dropdownItem} />
			))}
		</>
	);
};

export const SelectionExtensionNestedDropdownMenu = ({
	nestedDropdownMenu,
}: SelectionExtensionNestedDropdownMenuProps) => {
	return (
		<ToolbarNestedDropdownMenu
			text={nestedDropdownMenu.label}
			elemBefore={
				nestedDropdownMenu.icon ? createElement(nestedDropdownMenu.icon, { label: '' }) : undefined
			}
			elemAfter={<ChevronRightIcon label={'nested menu'} />}
		>
			<ChildItems nestedDropdownMenu={nestedDropdownMenu} />
		</ToolbarNestedDropdownMenu>
	);
};
