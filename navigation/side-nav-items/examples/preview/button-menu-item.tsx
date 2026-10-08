import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import HomeIcon from '@atlaskit/icon/core/home';
import { Box } from '@atlaskit/primitives/compiled/box';
import { ButtonMenuItem } from '@atlaskit/side-nav-items/button-menu-item';
import { MenuList } from '@atlaskit/side-nav-items/menu-list';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: '280px',
		display: 'block',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});

export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<MenuList>
					<ButtonMenuItem elemBefore={<HomeIcon label="" />} isSelected>
						Overview
					</ButtonMenuItem>
					<ButtonMenuItem>Board</ButtonMenuItem>
					<ButtonMenuItem>Reports</ButtonMenuItem>
				</MenuList>
			</Box>
		</IntlProvider>
	);
}
