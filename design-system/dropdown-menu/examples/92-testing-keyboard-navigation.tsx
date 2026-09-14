import React from 'react';

import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import { Label } from '@atlaskit/form/label/default';
import { Stack } from '@atlaskit/primitives/compiled';
import Toggle from '@atlaskit/toggle';

import NestedDropdownMenuExample from './12-nested-dropdown';

export default (): React.JSX.Element => (
	<div>
		<DropdownMenu trigger="New behavior" testId="dropdown" shouldRenderToParent>
			<DropdownItemGroup>
				<DropdownItem testId="dropdown--item">Move</DropdownItem>
				<DropdownItem>Clone</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
		<Stack>
			<Label htmlFor="toggle-1">Allow pull requests</Label>
			<Toggle id="toggle-1" />
		</Stack>
		<NestedDropdownMenuExample />
		<Stack>
			<Label htmlFor="toggle-2">Allow contributions</Label>
			<Toggle id="toggle-2" />
		</Stack>
	</div>
);
