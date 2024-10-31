/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import Heading from '@atlaskit/heading';

import { Box, Inline, Stack } from '../src/compiled';

const backgroundColors = [
	'color.background.disabled',
	'color.background.input',
	'color.background.inverse.subtle',
	'color.background.neutral',
	'color.background.neutral.subtle',
	'color.background.neutral.bold',
	'color.background.selected',
	'color.background.selected.bold',
	'color.background.brand.bold',
	'color.background.danger',
	'color.background.danger.bold',
	'color.background.warning',
	'color.background.warning.bold',
	'color.background.success',
	'color.background.success.bold',
	'color.background.discovery',
	'color.background.discovery.bold',
	'color.background.information',
	'color.background.information.bold',
	'color.blanket',
	'color.blanket.selected',
	'color.blanket.danger',
	'elevation.surface',
	'elevation.surface.overlay',
	'elevation.surface.raised',
	'elevation.surface.sunken',
] as const;

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
				</Inline>
			</Stack>
		</Stack>
	);
};
