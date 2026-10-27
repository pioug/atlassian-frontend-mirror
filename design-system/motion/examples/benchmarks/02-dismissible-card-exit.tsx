import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

import { BenchmarkLayout, BenchmarkSurface } from './shared';

/**
 * Benchmark prompt:
 * Add motion when the announcement card is dismissed. It should remain visible until its exit
 * motion finishes.
 */
export default function DismissibleCardExitBenchmark(): JSX.Element {
	const [isVisible, setIsVisible] = useState(true);

	return (
		<BenchmarkLayout title="Dismissible card" description="Dismiss and restore the announcement.">
			<Stack space="space.150">
				{isVisible && (
					<BenchmarkSurface>
						<Stack space="space.100">
							<Text weight="semibold">Planning starts tomorrow</Text>
							<Text>Review the roadmap before the team planning session.</Text>
							<Inline>
								<Button onClick={() => setIsVisible(false)}>Dismiss</Button>
							</Inline>
						</Stack>
					</BenchmarkSurface>
				)}
				{!isVisible && <Button onClick={() => setIsVisible(true)}>Restore announcement</Button>}
			</Stack>
		</BenchmarkLayout>
	);
}
