/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

import { BenchmarkLayout, BenchmarkSurface } from './shared';

const templates = ['Roadmap', 'Sprint plan', 'Retrospective', 'Project brief', 'Decision', 'Goals'];

const styles = cssMap({
	grid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
		gap: token('space.100'),
	},
});

/**
 * Benchmark prompt:
 * Add entry motion to this three-column template gallery so the sequence reflects its grid layout.
 * It must render safely during SSR.
 */
export default function StaggerGridBenchmark(): JSX.Element {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<BenchmarkLayout title="Template gallery" description="Show a fixed three-column gallery.">
			<Button onClick={() => setIsVisible((visible) => !visible)}>
				{isVisible ? 'Hide templates' : 'Show templates'}
			</Button>
			{isVisible && (
				<div css={styles.grid}>
					{templates.map((template) => (
						<BenchmarkSurface key={template}>
							<Text weight="semibold">{template}</Text>
						</BenchmarkSurface>
					))}
				</div>
			)}
		</BenchmarkLayout>
	);
}
