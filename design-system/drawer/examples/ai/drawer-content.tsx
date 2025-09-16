import React from 'react';

import { DrawerContent } from '@atlaskit/drawer';
import Heading from '@atlaskit/heading';
import { Text } from '@atlaskit/primitives/compiled';

export default [
	<DrawerContent>
		<Heading size="large">Content Title</Heading>
		<Text>This is the main content area of the drawer.</Text>
	</DrawerContent>,
	<DrawerContent>
		<Heading size="medium">Settings</Heading>
		<Text>Configure your preferences here.</Text>
	</DrawerContent>,
];
