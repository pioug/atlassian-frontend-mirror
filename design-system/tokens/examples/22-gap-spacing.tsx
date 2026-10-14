/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { JSX } from 'react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	row: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	xxsmall: { gap: token('space.gap.xxsmall') },
	xsmall: { gap: token('space.gap.xsmall') },
	small: { gap: token('space.gap.small') },
	medium: { gap: token('space.gap.medium') },
	large: { gap: token('space.gap.large') },
	xlarge: { gap: token('space.gap.xlarge') },
	xxlarge: { gap: token('space.gap.xxlarge') },
});

const sizes = ['xxsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge'] as const;

export default function GapSpacingExample(): JSX.Element {
	return (
		<Stack space="space.200">
			<Heading as="h2" size="small">
				Experimental gap spacing
			</Heading>
			{sizes.map((size) => (
				<Stack key={size} space="space.050">
					<strong>{`space.gap.${size}`}</strong>
					<Box xcss={cx(styles.row, styles[size])}>
						<Box padding="space.050" backgroundColor="color.background.discovery">
							First item
						</Box>
						<Box padding="space.050" backgroundColor="color.background.discovery">
							Second item
						</Box>
						<Box padding="space.050" backgroundColor="color.background.discovery">
							Third item
						</Box>
					</Box>
				</Stack>
			))}
		</Stack>
	);
}
