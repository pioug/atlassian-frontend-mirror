import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Inline from '@atlaskit/primitives/inline';

export default (): React.JSX.Element => {
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
				// Using a centered placement (not `bottom-start` or `bottom-end`) to better show repositioning,
				// as the start and end placements don't actually need to change the styles when the content changes.
				// This is because `bottom-start` positions relative to the left side of the screen,
				// and `bottom-end` positions relative to the right side of the screen.
				placement="bottom"
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
