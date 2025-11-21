import React from 'react';

import { Checkbox } from '@atlaskit/checkbox';
import { cssMap } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Heading from '@atlaskit/heading';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		paddingTop: token('space.100', '8px'),
		paddingRight: token('space.100', '8px'),
		paddingBottom: token('space.100', '8px'),
		paddingLeft: token('space.100', '8px'),
	},
});

export default (): React.JSX.Element => {
	return (
		<>
			<Heading size="small">
				focus will go to trigger when dropdown is closed with Esc or Shift+Tab
			</Heading>

			<Box xcss={styles.container}>
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
