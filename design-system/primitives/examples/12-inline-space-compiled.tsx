/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const spaceItems = [
	'space.0',
	'space.025',
	'space.050',
	'space.075',
	'space.100',
	'space.150',
	'space.200',
	'space.250',
	'space.300',
	'space.400',
	'space.500',
	'space.600',
	'space.800',
	'space.1000',
] as const;

const styles = cssMap({
	container: { width: '24px' },
	spaceValue: { minWidth: '80px' },
	block: {
		borderRadius: token('radius.xsmall'),
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
	padded: {
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
	},
});

export default () => (
	<div data-testid="inline-example" css={styles.padded}>
		<Inline space="space.1000">
			<Stack space="space.100" testId="inline-space">
				<Heading size="large">space</Heading>
				{spaceItems.map((space) => (
					<Inline>
						<span css={styles.spaceValue}>{space}</span>
						<Inline space={space}>
							<Box xcss={styles.block} backgroundColor="color.background.discovery.bold" />
							<Box xcss={styles.block} backgroundColor="color.background.discovery.bold" />
						</Inline>
					</Inline>
				))}
			</Stack>

			<Stack space="space.100" testId="inline-rowSpace">
				<Heading size="large">rowSpace</Heading>
				{spaceItems.map((space) => (
					<div css={styles.container}>
						<Inline>
							<span css={styles.spaceValue}>{space}</span>
							<Inline rowSpace={space} shouldWrap>
								<Box xcss={styles.block} backgroundColor="color.background.discovery.bold" />
								<Box xcss={styles.block} backgroundColor="color.background.discovery.bold" />
							</Inline>
						</Inline>
					</div>
				))}
			</Stack>
		</Inline>
	</div>
);
