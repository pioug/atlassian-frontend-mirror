import React, { type ComponentType } from 'react';

import Heading from '@atlaskit/heading';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Grid, Stack, Text, xcss } from '@atlaskit/primitives';

import * as componentList from './artifacts/icons';

const iconTileStyles = xcss({
	justifyContent: 'center',
	alignItems: 'center',
	gap: 'space.100',
	padding: 'space.100',
});

const IconTile = ({ component, name }: { name: string; component: ComponentType<any> }) => {
	const Icon = component;

	return (
		<Stack xcss={iconTileStyles}>
			<Icon />
			<Text>{name}</Text>
		</Stack>
	);
};

const LegacyIconAllExample = () => {
	return (
		<Box padding="space.200">
			<Stack space="space.300">
				<Heading size="small">Legacy custom icons</Heading>
				<Grid
					testId="legacy-icon-explorer"
					gap="space.200"
					templateColumns="repeat(auto-fill, minmax(160px, 1fr))"
				>
					{Object.keys(componentList).map((name) => {
						// @ts-ignore
						const component = componentList[name];
						return <IconTile component={component} name={name} key={name} />;
					})}
				</Grid>
			</Stack>
		</Box>
	);
};

export default LegacyIconAllExample;
