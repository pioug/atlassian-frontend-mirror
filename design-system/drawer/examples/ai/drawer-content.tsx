import React from 'react';

import { DrawerContent } from '@atlaskit/drawer/drawer-content';
import Heading from '@atlaskit/heading/heading';
import { Text } from '@atlaskit/primitives/compiled/text';

const Examples = (): React.JSX.Element => (
	<>
		<DrawerContent>
			<Heading size="large">Content Title</Heading>
			<Text>This is the main content area of the drawer.</Text>
		</DrawerContent>
		<DrawerContent>
			<Heading size="medium">Settings</Heading>
			<Text>Configure your preferences here.</Text>
		</DrawerContent>
	</>
);
export default Examples;
