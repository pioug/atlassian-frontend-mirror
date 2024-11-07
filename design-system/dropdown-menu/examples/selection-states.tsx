import React from 'react';

import DropdownMenu, {
	DropdownItem,
	DropdownItemCheckbox,
	DropdownItemGroup,
	DropdownItemRadio,
} from '@atlaskit/dropdown-menu';
import { Box } from '@atlaskit/primitives';

export default () => (
	<Box padding="space.150">
		<DropdownMenu testId="dropdown" isOpen trigger="Filter cities" shouldRenderToParent>
			<DropdownItemGroup>
				<DropdownItemCheckbox id="checkbox" isSelected>
					Checkbox
				</DropdownItemCheckbox>
				<DropdownItemRadio id="radio" isSelected>
					Radio
				</DropdownItemRadio>
				<DropdownItem isSelected>Item</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	</Box>
);
