import React from 'react';

import Heading from '@atlaskit/heading';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';

const backgroundColors = [
	'color.background.disabled',
	'color.background.input',
	'color.background.inverse.subtle',
	'color.background.neutral',
	'color.background.neutral.subtle',
	'color.background.selected',
	'color.background.danger',
	'color.background.warning',
	'color.background.warning.bold',
	'color.background.success',
	'color.background.discovery',
	'color.background.information',
	'color.blanket.selected',
	'color.blanket.danger',
	'elevation.surface',
	'elevation.surface.overlay',
	'elevation.surface.raised',
	'elevation.surface.sunken',
] as const;

const backgroundColorsInverse = [
	'color.background.neutral.bold',
	'color.background.selected.bold',
	'color.background.brand.bold',
	'color.background.danger.bold',
	'color.background.success.bold',
	'color.background.discovery.bold',
	'color.background.information.bold',
] as const;

const inverseStyles = xcss({
	color: 'color.text.inverse',
});

export default () => {
	return (
		<Stack space="space.400" alignInline="start">
			<Stack space="space.200" testId="box-with-backgroundColor">
				<Heading size="medium">backgroundColor</Heading>
				<Inline space="space.200" alignBlock="center" shouldWrap={true}>
					{backgroundColors.map((color) => (
						<Box key={color} backgroundColor={color} padding="space.400">
							<Box>{color}</Box>
						</Box>
					))}
					{backgroundColorsInverse.map((color) => (
						<Box key={color} backgroundColor={color} padding="space.400" xcss={inverseStyles}>
							<Box>{color}</Box>
						</Box>
					))}
				</Inline>
			</Stack>
		</Stack>
	);
};
