import React from 'react';

import Button from '@atlaskit/button/default/button';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';

export default (): React.JSX.Element => (
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
