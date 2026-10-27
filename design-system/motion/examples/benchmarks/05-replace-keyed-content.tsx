import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

import { BenchmarkLayout, BenchmarkSurface } from './shared';

const projects = [
	{ id: 'atlas', name: 'Atlas', summary: 'Improve project visibility across the company.' },
	{ id: 'compass', name: 'Compass', summary: 'Create a catalog of software components.' },
];

/**
 * Benchmark prompt:
 * Add motion when the selected project's summary is replaced by another project's summary. Avoid
 * showing both summaries as the current content.
 */
export default function ReplaceKeyedContentBenchmark(): JSX.Element {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const project = projects[selectedIndex];

	return (
		<BenchmarkLayout title="Project summary" description="Switch between project summaries.">
			<Stack space="space.150">
				<Inline space="space.100">
					{projects.map((item, index) => (
						<Button
							key={item.id}
							appearance={selectedIndex === index ? 'primary' : 'default'}
							onClick={() => setSelectedIndex(index)}
						>
							{item.name}
						</Button>
					))}
				</Inline>
				<BenchmarkSurface>
					<Stack space="space.050">
						<Text weight="semibold">{project.name}</Text>
						<Text>{project.summary}</Text>
					</Stack>
				</BenchmarkSurface>
			</Stack>
		</BenchmarkLayout>
	);
}
