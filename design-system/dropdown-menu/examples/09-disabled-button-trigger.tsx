import React from 'react';

import Button from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';

export default () => (
	<DropdownMenu
		shouldRenderToParent
		trigger={(providedProps) => (
			<Button isDisabled {...providedProps}>
				Disabled button
			</Button>
		)}
	>
		<DropdownItemGroup>
			<DropdownItem>Sydney</DropdownItem>
			<DropdownItem>Melbourne</DropdownItem>
		</DropdownItemGroup>
	</DropdownMenu>
);
