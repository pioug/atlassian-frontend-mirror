/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-selectors */
import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, media, Stack, xcss } from '@atlaskit/primitives';

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
			content: '"(min-width: 110.5rem)"',
		},
	},
});

export default function Basic(): React.JSX.Element {
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
