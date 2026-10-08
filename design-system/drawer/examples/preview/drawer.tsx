import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import Drawer from '@atlaskit/drawer/drawer';
import { DrawerCloseButton } from '@atlaskit/drawer/drawer-close-button';
import { DrawerContent } from '@atlaskit/drawer/drawer-content';
import { DrawerSidebar } from '@atlaskit/drawer/drawer-sidebar';
import Heading from '@atlaskit/heading/heading';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
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
				<Drawer isOpen label="Project details">
					<DrawerSidebar>
						<DrawerCloseButton />
					</DrawerSidebar>
					<DrawerContent>
						<Stack space="space.200">
							<Heading size="medium">Atlas project</Heading>
							<Text>Project details and activity</Text>
						</Stack>
					</DrawerContent>
				</Drawer>
			</Box>
		</IntlProvider>
	);
}
