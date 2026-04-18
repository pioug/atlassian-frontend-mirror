/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap } from '@compiled/react';

import { Code } from '@atlaskit/code';
import { jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import ImageIcon from '@atlaskit/icon/core/image';
import Lozenge from '@atlaskit/lozenge/new';
import type { AccentColor, SemanticColor } from '@atlaskit/lozenge/new';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
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
});

const semanticColors: SemanticColor[] = [
	'success',
	'warning',
	'danger',
	'information',
	'discovery',
	'neutral',
];

const accentColors: AccentColor[] = [
	'accent-blue',
	'accent-red',
	'accent-yellow',
	'accent-green',
	'accent-teal',
	'accent-purple',
	'accent-lime',
	'accent-orange',
	'accent-magenta',
	'accent-gray',
];

/**
 * Example using the new `/new` entrypoint which exports the new Lozenge component
 * directly without requiring the `platform-dst-lozenge-tag-badge-visual-uplifts` feature flag.
 *
 * This entrypoint is intended for products that don't have access to feature flags (e.g. Statsig).
 * It will be removed after the visual uplift rollout is complete, which will require cleanup in
 * callsites (updating import paths back to `@atlaskit/lozenge`).
 * If your app has access to feature flags, please use the default entrypoint instead.
 *
 * Usage: `import Lozenge from '@atlaskit/lozenge/new';`
 */
export default function NewEntrypointLozengeExample(): JSX.Element {
	return (
		<div css={styles.container}>
			<Stack space="space.200">
				<Heading size="large">Lozenge — /new entrypoint</Heading>
				<Text>
					These lozenges are imported from <Code>@atlaskit/lozenge/new</Code> and render the new
					visual refresh without needing the feature flag. This entrypoint is intended for products
					that don't have access to feature flags. It will be removed after rollout, requiring
					callsite cleanup. If your app has access to feature flags, please use the default
					entrypoint instead.
				</Text>
			</Stack>

			{/* Semantic colors */}
			<div css={styles.section}>
				<Heading size="medium">Semantic Colors</Heading>
				<div css={styles.group}>
					{semanticColors.map((color) => (
						<Lozenge key={color} appearance={color}>
							{color}
						</Lozenge>
					))}
				</div>
			</div>

			{/* Semantic colors - bold */}
			<div css={styles.section}>
				<Heading size="medium">Semantic Colors (Bold)</Heading>
				<div css={styles.group}>
					{semanticColors.map((color) => (
						<Lozenge key={color} appearance={color} isBold>
							{color}
						</Lozenge>
					))}
				</div>
			</div>

			{/* Accent colors */}
			<div css={styles.section}>
				<Heading size="medium">Accent Colors</Heading>
				<div css={styles.group}>
					{accentColors.map((color) => (
						<Lozenge key={color} appearance={color}>
							{color}
						</Lozenge>
					))}
				</div>
			</div>

			{/* With icon */}
			<div css={styles.section}>
				<Heading size="medium">With Icon</Heading>
				<div css={styles.group}>
					<Lozenge appearance="success" iconBefore={ImageIcon}>
						With icon
					</Lozenge>
					<Lozenge appearance="information" iconBefore={ImageIcon}>
						Information
					</Lozenge>
				</div>
			</div>

			{/* Spacious spacing */}
			<div css={styles.section}>
				<Heading size="medium">Spacious Spacing</Heading>
				<div css={styles.group}>
					<Lozenge appearance="success" spacing="spacious">
						Spacious
					</Lozenge>
					<Lozenge appearance="neutral" spacing="spacious">
						Default spacious
					</Lozenge>
				</div>
			</div>

			{/* Truncation */}
			<div css={styles.section}>
				<Heading size="medium">Truncation</Heading>
				<Box>
					<Inline space="space.100" alignBlock="center">
						<Lozenge appearance="success" maxWidth={100}>
							Very long lozenge text that should truncate
						</Lozenge>
						<Lozenge appearance="information">Short</Lozenge>
					</Inline>
				</Box>
			</div>
		</div>
	);
}
