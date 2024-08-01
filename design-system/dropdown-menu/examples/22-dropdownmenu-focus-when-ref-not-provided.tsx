import React from 'react';

import { Checkbox } from '@atlaskit/checkbox';
import Heading from '@atlaskit/heading';
import { Box, Inline } from '@atlaskit/primitives';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

export default () => {
	return (
		<>
			<Heading level="h500">
				focus will go to trigger when dropdown is closed with Esc or Shift+Tab
			</Heading>

			<Box padding="space.100">
				<Inline space="space.300">
					<DropdownMenu
						trigger="Actions"
						onOpenChange={(e) => console.log('dropdown opened', e)}
						testId="dropdown"
						shouldRenderToParent
					>
						<DropdownItemGroup>
							<DropdownItem>Move</DropdownItem>
							<DropdownItem>Clone</DropdownItem>
							<DropdownItem>Delete</DropdownItem>
						</DropdownItemGroup>
					</DropdownMenu>

					<Checkbox label="One" value="1" name="checkbox1" />
					<Checkbox label="Two" value="2" name="checkbox2" />
					<Checkbox label="Three" value="3" name="checkbox3" />
				</Inline>
			</Box>
		</>
	);
};
