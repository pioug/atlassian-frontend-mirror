import React, { useRef } from 'react';

import { Checkbox } from '@atlaskit/checkbox/checkbox';
import { cssMap } from '@atlaskit/css';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import Heading from '@atlaskit/heading/heading';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
});

function DropdownWithReturnFocusRef({ shouldRenderToParent }: { shouldRenderToParent: boolean }) {
	const ref = useRef<HTMLInputElement>(null);

	return (
		<Box xcss={styles.container}>
			<Inline space="space.300">
				{/* eslint-disable-next-line @atlaskit/design-system/use-should-render-to-parent */}
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

export default function ExampleComponent(): React.JSX.Element {
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
