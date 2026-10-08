import React from 'react';

import { IntlProvider } from 'react-intl';

import Button from '@atlaskit/button/default/button';
import { cssMap } from '@atlaskit/css';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	trigger: { visibility: 'hidden' },
	subject: {
		width: 'fit-content',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});

export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<DropdownMenu
					trigger={({ triggerRef, ...props }) => (
						<Box xcss={styles.trigger}>
							<Button {...props} ref={triggerRef}>
								Actions
							</Button>
						</Box>
					)}
					isOpen
					shouldRenderToParent
				>
					<DropdownItemGroup>
						<DropdownItem>Edit</DropdownItem>
						<DropdownItem>Duplicate</DropdownItem>
						<DropdownItem>Archive</DropdownItem>
					</DropdownItemGroup>
				</DropdownMenu>
			</Box>
		</IntlProvider>
	);
}
