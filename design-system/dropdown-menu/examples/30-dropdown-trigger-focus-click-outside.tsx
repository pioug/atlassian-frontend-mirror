import React from 'react';

import Button from '@atlaskit/button/default/button';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import { Label } from '@atlaskit/form/label/default';
import { Flex, Stack } from '@atlaskit/primitives/compiled';
import Textfield from '@atlaskit/textfield/text-field';

const DropdownMenuDefaultExample = (): React.JSX.Element => {
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
