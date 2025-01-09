import React, { useRef } from 'react';

import { Checkbox } from '@atlaskit/checkbox';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Heading from '@atlaskit/heading';
import { Box, Inline } from '@atlaskit/primitives';

function DropdownWithReturnFocusRef({ shouldRenderToParent }: { shouldRenderToParent: boolean }) {
	const ref = useRef<HTMLInputElement>(null);

	return (
		<Box padding="space.100">
			<Inline space="space.300">
				<DropdownMenu
					trigger="Actions"
					onOpenChange={(e) => console.log('dropdown opened', e)}
					testId="dropdown"
					shouldRenderToParent={shouldRenderToParent}
					returnFocusRef={ref}
				>
					<DropdownItemGroup>
						<DropdownItem>Move</DropdownItem>
						<DropdownItem>Clone</DropdownItem>
						<DropdownItem>Delete</DropdownItem>
					</DropdownItemGroup>
				</DropdownMenu>

				<Checkbox label="One" value="1" name="checkbox1" />
				<Checkbox label="Two" value="2" name="checkbox2" ref={ref} />
				<Checkbox label="Three" value="3" name="checkbox3" />
			</Inline>
		</Box>
	);
}

export default function ExampleComponent() {
	return (
		<>
			<Heading size="small">
				returnFocusRef ref is set to checkbox two, focus will go there (rendered in parent)
			</Heading>

			<DropdownWithReturnFocusRef shouldRenderToParent />

			<Heading size="small">
				returnFocusRef ref is set to checkbox two, focus will go there (rendered in portal)
			</Heading>

			<DropdownWithReturnFocusRef shouldRenderToParent={false} />
		</>
	);
}
