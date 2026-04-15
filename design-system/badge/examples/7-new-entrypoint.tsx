/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import Badge from '@atlaskit/badge/new';
import type { BadgeNewProps } from '@atlaskit/badge/new';
import { Code } from '@atlaskit/code';
import Heading from '@atlaskit/heading';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		paddingBlockStart: token('space.300'),
		paddingInlineEnd: token('space.300'),
		paddingBlockEnd: token('space.300'),
		paddingInlineStart: token('space.300'),
		maxWidth: '800px',
	},
	card: {
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
		backgroundColor: token('color.background.neutral.subtle'),
		borderRadius: token('radius.small', '3px'),
		marginBlockEnd: token('space.200'),
	},
	grid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
		gap: token('space.200'),
	},
	item: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		backgroundColor: token('color.background.neutral'),
		borderRadius: token('radius.small', '3px'),
	},
	invertedBox: {
		backgroundColor: token('color.background.brand.bold'),
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
		borderRadius: token('radius.xsmall', '2px'),
	},
});

const appearances: BadgeNewProps['appearance'][] = [
	'success',
	'danger',
	'warning',
	'information',
	'discovery',
	'neutral',
	'inverse',
];

/**
 * Example using the new `/new` entrypoint which exports the new Badge component
 * directly without requiring the `platform-dst-lozenge-tag-badge-visual-uplifts` feature flag.
 *
 * This entrypoint is intended for products that don't have access to feature flags (e.g. Statsig).
 * It will be removed after the visual uplift rollout is complete, which will require cleanup in
 * callsites (updating import paths back to `@atlaskit/badge`).
 * If your app has access to feature flags, please use the default entrypoint instead.
 *
 * Usage: `import Badge from '@atlaskit/badge/new';`
 */
export default function NewEntrypointBadgeExample(): JSX.Element {
	return (
		<div css={styles.container}>
			<Stack space="space.200">
				<Heading size="large">Badge — /new entrypoint</Heading>
				<Text>
					These badges are imported from <Code>@atlaskit/badge/new</Code> and render the new visual
					refresh without needing the feature flag. This entrypoint is intended for products
					that don't have access to feature flags. It will be removed after rollout, requiring
					callsite cleanup. If your app has access to feature flags, please use the default entrypoint instead.
				</Text>

				{/* All new appearances */}
				<div css={styles.card}>
					<Heading size="medium">All Appearances</Heading>
					<div css={styles.grid}>
						{appearances
							.filter((a) => a !== 'inverse')
							.map((appearance) => (
								<div css={styles.item} key={appearance}>
									<Text>{appearance}</Text>
									<Badge appearance={appearance}>{42}</Badge>
								</div>
							))}
						<Box xcss={styles.invertedBox}>
							<Inline space="space.100" alignBlock="center">
								<Text color="color.text.inverse">inverse</Text>
								<Badge appearance="inverse">{8}</Badge>
							</Inline>
						</Box>
					</div>
				</div>

				{/* Max values */}
				<div css={styles.card}>
					<Heading size="medium">With Max Values</Heading>
					<div css={styles.grid}>
						<div css={styles.item}>
							<Text>max=99 (default)</Text>
							<Badge appearance="neutral">{500}</Badge>
						</div>
						<div css={styles.item}>
							<Text>max=50</Text>
							<Badge appearance="information" max={50}>
								{75}
							</Badge>
						</div>
						<div css={styles.item}>
							<Text>max=false</Text>
							<Badge appearance="success" max={false}>
								{12345}
							</Badge>
						</div>
					</div>
				</div>
			</Stack>
		</div>
	);
}
