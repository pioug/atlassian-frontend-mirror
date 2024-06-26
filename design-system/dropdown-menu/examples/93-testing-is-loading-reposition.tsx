import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import Inline from '@atlaskit/primitives/inline';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

export default () => {
	const [isLoading, setLoading] = useState(true);

	return (
		<Inline space="space.200">
			<Button testId="toggle" onClick={() => setLoading((loadingState) => !loadingState)}>
				Toggle isLoading
			</Button>
			<DropdownMenu
				trigger="Page actions"
				isOpen
				testId="dropdown"
				isLoading={isLoading}
				placement="bottom-end"
				shouldRenderToParent
			>
				<DropdownItemGroup>
					<DropdownItem>Move</DropdownItem>
					<DropdownItem>Clone</DropdownItem>
					<DropdownItem>Delete</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>
		</Inline>
	);
};
