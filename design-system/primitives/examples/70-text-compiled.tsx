import React from 'react';

import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	customStylesContainer: {
		width: '200px',
		borderWidth: token('border.width.selected'),
		borderColor: token('color.border.accent.magenta'),
		borderStyle: 'solid',
	},
	customOverflowWrap: { overflowWrap: 'normal' },
	customTextDecorationLine: { textDecorationLine: 'line-through' },
});

const sizes = ['small', 'UNSAFE_small', 'medium', 'large'] as const;
const weights = ['regular', 'medium', 'semibold', 'bold'] as const;
const alignments = ['start', 'center', 'end'] as const;

export default () => {
	return (
		<Stack space="space.300">
			<section>
				<Stack space="space.100">
					<Heading size="medium" as="h3">
						Sizes
					</Heading>
					{sizes.map((size) => (
						<Text key={size} size={size} testId="text-example">
							Text size: {size}
						</Text>
					))}
				</Stack>
			</section>
			<section>
				<Stack space="space.100">
					<Heading size="medium" as="h3">
						Weights
					</Heading>
					{weights.map((weight) => (
						<Text key={weight} weight={weight}>
							Text weight: {weight}
						</Text>
					))}
				</Stack>
			</section>
			<section>
				<Stack space="space.100">
					<Heading size="medium" as="h3">
						Alignment
					</Heading>
					{alignments.map((alignment) => (
						<Text key={alignment} align={alignment}>
							Text alignment: {alignment}
						</Text>
					))}
				</Stack>
			</section>
			<section>
				<Stack space="space.100">
					<Heading size="medium" as="h3">
						Rendered element
					</Heading>
					<Text as="strong">Text as strong tag</Text>
					<Text as="em">Text as em tag</Text>
					<Text>Text is rendered as a {'<span>'} by default</Text>
				</Stack>
			</section>
			<section>
				<Stack space="space.100">
					<Heading size="medium" as="h3">
						Composing text
					</Heading>
					<Text size="large">
						Large text composing{' '}
						<Text as="em">
							em text inheriting large text size{' '}
							<Text size="small">
								and nested small text composing{' '}
								<Text as="strong">strong text inheriting small text size</Text>
							</Text>
						</Text>
					</Text>
				</Stack>
			</section>
			<section>
				<Stack space="space.100">
					<Heading size="medium" as="h3">
						Custom styles
					</Heading>
					<Text xcss={styles.customTextDecorationLine}>Striked through text</Text>
					<Inline space="space.100">
						<Box xcss={styles.customStylesContainer}>
							<Text>
								Default overflow wrap with a really long word
								Vierhundertvierundvierzigtausendvierhundertvierundvierzig that can break to avoid
								overflowing its container.
							</Text>
						</Box>
						<Box xcss={styles.customStylesContainer}>
							<Text xcss={styles.customOverflowWrap}>
								Custom overflow wrap with a really long word
								Vierhundertvierundvierzigtausendvierhundertvierundvierzig that overflows its
								container.
							</Text>
						</Box>
					</Inline>
				</Stack>
			</section>
		</Stack>
	);
};
