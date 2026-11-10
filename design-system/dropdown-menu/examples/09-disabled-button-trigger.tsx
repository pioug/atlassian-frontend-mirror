import React from 'react';

import Button from '@atlaskit/button/default/button';
import { DropdownItem } from '@atlaskit/dropdown-menu/dropdown-item';
import { DropdownItemGroup } from '@atlaskit/dropdown-menu/dropdown-item-group';
import { DropdownMenu } from '@atlaskit/dropdown-menu/dropdown-menu';

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
