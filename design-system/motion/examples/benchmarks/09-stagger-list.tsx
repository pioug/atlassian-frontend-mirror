import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

import { BenchmarkLayout, BenchmarkSurface } from './shared';

const results = [
	'Motion guidance',
	'Motion tokens',
	'Motion accessibility',
	'Motion migration',
	'Motion examples',
];

/**
 * Benchmark prompt:
 * Add a subtle sequential entrance when these search results first appear. The list may contain
 * dozens of items.
 */
export default function StaggerListBenchmark(): JSX.Element {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<BenchmarkLayout title="Search results" description="Load a list of matching Motion resources.">
			<Stack space="space.150">
				<Button onClick={() => setIsVisible((visible) => !visible)}>
					{isVisible ? 'Clear results' : 'Show results'}
				</Button>
				{isVisible && (
					<Stack space="space.100">
						{results.map((result) => (
							<BenchmarkSurface key={result}>
								<Text>{result}</Text>
							</BenchmarkSurface>
						))}
					</Stack>
				)}
			</Stack>
		</BenchmarkLayout>
	);
}
