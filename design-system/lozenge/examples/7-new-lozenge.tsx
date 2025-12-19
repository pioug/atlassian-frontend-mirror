/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap } from '@compiled/react';

import { jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import ImageIcon from '@atlaskit/icon/core/image';
import Lozenge, { type NewLozengeColor, type ThemeAppearance } from '@atlaskit/lozenge';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.200'),
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
	section: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.100'),
	},
	group: {
		display: 'flex',
		gap: token('space.100'),
		flexWrap: 'wrap',
		alignItems: 'center',
	},
	label: {
		font: token('font.body'),
		color: token('color.text.subtlest'),
		marginBlockEnd: token('space.050'),
	},
});

/**
 * Example showcasing the new lozenge component with semantic and accent colors.
 *
 * Note: This example requires the `platform-dst-lozenge-tag-badge-visual-uplifts` feature flag to be enabled.
 */
export default function NewLozengeExample() {
	const semanticColors: NewLozengeColor[] = [
		'success',
		'warning',
		'danger',
		'information',
		'discovery',
		'neutral',
	];

	const accentColors: NewLozengeColor[] = [
		'accent-red',
		'accent-orange',
		'accent-yellow',
		'accent-lime',
		'accent-green',
		'accent-teal',
		'accent-blue',
		'accent-purple',
		'accent-magenta',
		'accent-gray',
	];

	// Legacy semantic appearance values for backward compatibility
	const legacyAppearances = [
		'default',
		'success',
		'removed',
		'inprogress',
		'new',
		'moved',
	] as const;

	return (
		<Box xcss={styles.container}>
			<Text>
				Enable the <code>platform-dst-lozenge-tag-badge-visual-uplifts</code> feature flag to see
				the new lozenge component.
			</Text>
			<Box>
				<Heading size="medium">Semantic colors</Heading>
				<Text>Lozenges with semantic colors from the design system.</Text>

				<Box xcss={styles.section}>
					{semanticColors.map((color) => (
						<Box key={color}>
							<Box xcss={styles.label}>{color}</Box>
							<Box xcss={styles.group}>
								<Lozenge appearance={color}>{color}</Lozenge>
								<Lozenge appearance={color} iconBefore={ImageIcon}>
									{color}
								</Lozenge>
							</Box>
						</Box>
					))}
				</Box>
			</Box>

			<Box>
				<Heading size="medium">Accent colors</Heading>
				<Text>Lozenges with accent colors from the design system.</Text>
				<Box xcss={styles.section}>
					{accentColors.map((color) => (
						<Box key={color}>
							<Box xcss={styles.label}>{color}</Box>
							<Box xcss={styles.group}>
								<Lozenge appearance={color}>{color}</Lozenge>
								<Lozenge appearance={color} iconBefore={ImageIcon}>
									{color}
								</Lozenge>
							</Box>
						</Box>
					))}
				</Box>
			</Box>

			<Box>
				<Heading size="medium">With max width</Heading>
				<Text>Lozenges with constrained max-width showing text truncation.</Text>
				<Box xcss={styles.group}>
					<Lozenge appearance="success" maxWidth={100}>
						This is a very long label
					</Lozenge>
					<Lozenge appearance="danger" maxWidth={80}>
						Another long label
					</Lozenge>
				</Box>
			</Box>
			<Box>
				<Heading size="medium">Legacy semantic appearances (backward compatibility)</Heading>
				<Text>Legacy appearance values that are automatically mapped to new semantic colors.</Text>
				<Box xcss={styles.section}>
					{legacyAppearances.map((appearance: ThemeAppearance) => (
						<Box key={appearance}>
							<Box xcss={styles.group}>
								<Lozenge appearance={appearance}>{appearance}</Lozenge>
								<Lozenge appearance={appearance} isBold>
									{appearance} bold
								</Lozenge>
							</Box>
						</Box>
					))}
				</Box>
			</Box>
		</Box>
	);
}
