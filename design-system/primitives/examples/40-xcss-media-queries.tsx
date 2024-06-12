/* eslint-disable @atlaskit/design-system/no-nested-styles */
import React from 'react';

import { Box, Inline, media, Stack, xcss } from '../src';

const aboveStyles = xcss({
	'@media all': {
		':after': {
			content: '"all"',
		},
	},
	[media.above.xs]: {
		':after': {
			content: '"(min-width: 30rem)"',
		},
	},
	[media.above.sm]: {
		':after': {
			content: '"(min-width: 48rem)"',
		},
	},
	[media.above.md]: {
		':after': {
			content: '"(min-width: 64rem)"',
		},
	},
	[media.above.lg]: {
		':after': {
			content: '"(min-width: 90rem)"',
		},
	},
	[media.above.xl]: {
		':after': {
			content: '"(min-width: 110rem)"',
		},
	},
});

export default function Basic() {
	return (
		<Box testId="media-query-example" padding="space.200">
			<Stack space="space.200">
				<Inline alignBlock="center">
					<Box as="span">Above:</Box>
					<Box testId="box-above-mq" padding="space.100" xcss={aboveStyles} />
				</Inline>
			</Stack>
		</Box>
	);
}
