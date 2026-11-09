/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { JSX } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	xxsmall: {
		paddingBlockStart: token('space.inset.xxsmall'),
		paddingInlineEnd: token('space.inset.xxsmall'),
		paddingBlockEnd: token('space.inset.xxsmall'),
		paddingInlineStart: token('space.inset.xxsmall'),
	},
	xsmall: {
		paddingBlockStart: token('space.inset.xsmall'),
		paddingInlineEnd: token('space.inset.xsmall'),
		paddingBlockEnd: token('space.inset.xsmall'),
		paddingInlineStart: token('space.inset.xsmall'),
	},
	small: {
		paddingBlockStart: token('space.inset.small'),
		paddingInlineEnd: token('space.inset.small'),
		paddingBlockEnd: token('space.inset.small'),
		paddingInlineStart: token('space.inset.small'),
	},
	medium: {
		paddingBlockStart: token('space.inset.medium'),
		paddingInlineEnd: token('space.inset.medium'),
		paddingBlockEnd: token('space.inset.medium'),
		paddingInlineStart: token('space.inset.medium'),
	},
	large: {
		paddingBlockStart: token('space.inset.large'),
		paddingInlineEnd: token('space.inset.large'),
		paddingBlockEnd: token('space.inset.large'),
		paddingInlineStart: token('space.inset.large'),
	},
	xlarge: {
		paddingBlockStart: token('space.inset.xlarge'),
		paddingInlineEnd: token('space.inset.xlarge'),
		paddingBlockEnd: token('space.inset.xlarge'),
		paddingInlineStart: token('space.inset.xlarge'),
	},
	xxlarge: {
		paddingBlockStart: token('space.inset.xxlarge'),
		paddingInlineEnd: token('space.inset.xxlarge'),
		paddingBlockEnd: token('space.inset.xxlarge'),
		paddingInlineStart: token('space.inset.xxlarge'),
	},
	'3xlarge': {
		paddingBlockStart: token('space.inset.3xlarge'),
		paddingInlineEnd: token('space.inset.3xlarge'),
		paddingBlockEnd: token('space.inset.3xlarge'),
		paddingInlineStart: token('space.inset.3xlarge'),
	},
	'4xlarge': {
		paddingBlockStart: token('space.inset.4xlarge'),
		paddingInlineEnd: token('space.inset.4xlarge'),
		paddingBlockEnd: token('space.inset.4xlarge'),
		paddingInlineStart: token('space.inset.4xlarge'),
	},
	'5xlarge': {
		paddingBlockStart: token('space.inset.5xlarge'),
		paddingInlineEnd: token('space.inset.5xlarge'),
		paddingBlockEnd: token('space.inset.5xlarge'),
		paddingInlineStart: token('space.inset.5xlarge'),
	},
});

const sizes = [
	'xxsmall',
	'xsmall',
	'small',
	'medium',
	'large',
	'xlarge',
	'xxlarge',
	'3xlarge',
	'4xlarge',
	'5xlarge',
] as const;

export default function InsetSpacingExample(): JSX.Element {
	return (
		<Stack space="space.200">
			<Heading as="h2" size="small">
				Experimental inset spacing
			</Heading>
			{sizes.map((size) => (
				<Box key={size} xcss={styles[size]} backgroundColor="color.background.discovery">
					{`space.inset.${size}`}
				</Box>
			))}
		</Stack>
	);
}
