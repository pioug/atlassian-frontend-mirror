import React, { useState } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import {
	DropdownMenuWithKeyboardNavigation as DropdownMenu,
	type MenuItem,
} from '@atlaskit/editor-common/ui-menu';

import { type MenuItemsType } from '../../types';

import { SelectionExtensionDropdownMenuButton } from './SelectionExtensionDropdownMenuButton';

export type SelectionExtensionDropdownMenuProps = {
	items: MenuItemsType;
	onItemActivated?: (attrs: { item: MenuItem; shouldCloseMenu?: boolean }) => void;
} & WrappedComponentProps;
const SelectionExtensionDropdownMenuComponent = React.memo(
	({ items, onItemActivated }: SelectionExtensionDropdownMenuProps) => {
		const [isMenuOpen, setIsMenuOpen] = useState(false);
		return (
			<DropdownMenu
				section={{ hasSeparator: true }}
				isOpen={isMenuOpen}
				items={items}
				fitHeight={188}
				fitWidth={136}
				onItemActivated={onItemActivated}
				data-testid="selection-extension-dropdown-menu"
			>
				<SelectionExtensionDropdownMenuButton
					onClick={() => setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen)}
				/>
			</DropdownMenu>
		);
	},
);

export const SelectionExtensionDropdownMenu = injectIntl(SelectionExtensionDropdownMenuComponent);
