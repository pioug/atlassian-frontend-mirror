import React from 'react';

import { Label } from '@atlaskit/form';
import { Stack } from '@atlaskit/primitives';
import Toggle from '@atlaskit/toggle';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

import NestedDropdownMenuExample from './12-nested-dropdown';

export default () => (
	<div>
		<DropdownMenu trigger="New behavior" testId="dropdown" shouldRenderToParent>
			<DropdownItemGroup>
				<DropdownItem>Move</DropdownItem>
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
