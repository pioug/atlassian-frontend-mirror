/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

import { BenchmarkLayout } from './shared';

const styles = cssMap({
	page: {
		display: 'flex',
		minHeight: '280px',
	},
	sidebar: {
		flexShrink: 0,
		backgroundColor: token('elevation.surface.sunken'),
		borderInlineEndColor: token('color.border'),
		borderInlineEndStyle: 'solid',
		borderInlineEndWidth: token('border.width'),
		overflow: 'hidden',
		paddingBlockStart: token('space.150'),
		paddingBlockEnd: token('space.150'),
		paddingInlineStart: token('space.150'),
		paddingInlineEnd: token('space.150'),
	},
	compact: {
		width: '96px',
	},
	expanded: {
		width: '240px',
	},
	content: {
		flexGrow: 1,
		paddingBlockStart: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
	},
});

/**
 * Benchmark prompt:
 * Add appropriate motion when this persistent sidebar changes from compact to expanded. The
 * sidebar remains mounted throughout.
 */
export default function PersistentSidebarBenchmark(): JSX.Element {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<BenchmarkLayout title="Persistent sidebar" description="Resize a mounted navigation sidebar.">
			<div css={styles.page}>
				<nav
					aria-label="Project"
					css={[styles.sidebar, isExpanded ? styles.expanded : styles.compact]}
				>
					<Stack space="space.100">
						<Button onClick={() => setIsExpanded((expanded) => !expanded)}>
							{isExpanded ? 'Collapse' : 'Expand'}
						</Button>
						<Text>{isExpanded ? 'Project overview' : 'Overview'}</Text>
						<Text>{isExpanded ? 'Team calendar' : 'Calendar'}</Text>
					</Stack>
				</nav>
				<main css={styles.content}>
					<Stack space="space.100">
						<Text weight="semibold">Project overview</Text>
						<Text color="color.text.subtle">
							The content area reflows as the sidebar changes width.
						</Text>
					</Stack>
				</main>
			</div>
		</BenchmarkLayout>
	);
}
