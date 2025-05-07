import React from 'react';

import Button from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { Label } from '@atlaskit/form';
import { Flex, Stack } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';

const DropdownMenuDefaultExample = () => {
	return (
		<Stack space="space.200">
			<Flex gap="space.200" alignItems="center">
				<Button appearance="primary" testId="button-for-focus">
					For focus
				</Button>
				<DropdownMenu trigger="Page actions" shouldRenderToParent testId="dropdown">
					<DropdownItemGroup>
						<DropdownItem>Edit</DropdownItem>
						<DropdownItem>Share</DropdownItem>
						<DropdownItem>Move</DropdownItem>
						<DropdownItem>Clone</DropdownItem>
						<DropdownItem>Delete</DropdownItem>
						<DropdownItem>Report</DropdownItem>
					</DropdownItemGroup>
				</DropdownMenu>
			</Flex>
			<Stack>
				<Label htmlFor="input">Input for focus</Label>
				<Textfield id="input" testId="input-for-focus" />
			</Stack>
		</Stack>
	);
};

export default DropdownMenuDefaultExample;
