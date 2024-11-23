/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { CSSProperties, ReactNode } from 'react';

import { jsx } from '@compiled/react';

import { cssMap, cx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const alignInlineItems = ['start', 'center', 'end'] as const;
const alignBlockItems = ['start', 'center', 'end'] as const;
const spreadItems = ['space-between'] as const;
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
	block: { borderRadius: token('border.radius.050'), padding: token('space.200') },
	blockSmall: { padding: token('space.050') },
	container: {
		display: 'flex',
		borderRadius: token('border.radius.050'),
		padding: token('space.050'),
	},
	exampleWrapper: { padding: token('space.200') },
	setWidth: { width: '200px' },
	setHeight: { width: '200px' },
});

// NOTE: We just cheat with `style`, do not copy this pattern into your code…
const Block = (props: { compact?: boolean; style?: CSSProperties; children?: ReactNode }) => (
	<Box
		xcss={cx(styles.block, props.compact && styles.blockSmall)}
		backgroundColor="color.background.discovery.bold"
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
		style={props.style}
	>
		{props.children}
	</Box>
);

/**
 * Stack permutations.
 */
export default () => (
	<div css={styles.exampleWrapper}>
		<Stack space="space.400">
			<Stack space="space.300" alignInline="start">
				<Heading size="large" as="h2">
					Stack
				</Heading>
				<section>
					<Stack space="space.100">
						<Heading size="medium" as="h3">
							Align Block
						</Heading>
						<Inline spread="space-between" space="space.400">
							{alignBlockItems.map((alignBlock) => (
								<Stack key={alignBlock} space="space.050" alignInline="center">
									{alignBlock}

									<Box
										xcss={styles.container}
										backgroundColor="color.background.neutral"
										style={{
											// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
											height: '200px',
										}}
									>
										<Stack space="space.050" alignBlock={alignBlock}>
											<Block />
											<Block />
											<Block />
										</Stack>
									</Box>
								</Stack>
							))}
						</Inline>
					</Stack>
				</section>

				<section>
					<Stack space="space.100">
						<Heading size="medium" as="h3">
							Spread
						</Heading>
						<Inline spread="space-between" space="space.400">
							{spreadItems.map((spread) => (
								<Stack key={spread} space="space.050" alignInline="start">
									{spread}

									<Box
										xcss={styles.container}
										backgroundColor="color.background.neutral"
										style={{
											// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
											height: '200px',
										}}
									>
										<Stack space="space.050" spread={spread}>
											<Block />
											<Block />
											<Block />
										</Stack>
									</Box>
								</Stack>
							))}
						</Inline>
					</Stack>
				</section>

				<section>
					<Heading size="medium" as="h3">
						Align Inline
					</Heading>
					<Inline space="space.100">
						{alignInlineItems.map((alignInline) => (
							<Stack key={alignInline} alignInline="center">
								{alignInline}
								<Block
									compact
									style={{
										// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
										width: '200px',
									}}
								>
									<Stack grow="fill" alignInline={alignInline} space="space.050">
										<Block />
										<Block />
										<Block />
									</Stack>
								</Block>
							</Stack>
						))}
					</Inline>
				</section>

				<section>
					<Stack space="space.100">
						<Heading size="medium" as="h3">
							Space
						</Heading>
						<Inline space="space.200" spread="space-between">
							{spaceItems.map((space) => (
								<Stack key={space} space="space.100" alignInline="center">
									{space}
									<Block compact>
										<Stack space={space}>
											<Block />
											<Block />
										</Stack>
									</Block>
								</Stack>
							))}
						</Inline>
					</Stack>
				</section>
			</Stack>
		</Stack>
	</div>
);
