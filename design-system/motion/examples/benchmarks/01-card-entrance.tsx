import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

import { BenchmarkLayout, BenchmarkSurface } from './shared';

/**
 * Benchmark prompt:
 * Add motion when the new project card first appears. Keep the existing card design and behavior.
 */
export default function CardEntranceBenchmark(): JSX.Element {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<BenchmarkLayout
			title="Card entrance"
			description="Create a project card, then add an appropriate entrance."
		>
			<Stack space="space.150">
				<Button onClick={() => setIsVisible(true)} isDisabled={isVisible}>
					Create project
				</Button>
				{isVisible && (
					<BenchmarkSurface>
						<Stack space="space.050">
							<Text weight="semibold">Website refresh</Text>
							<Text color="color.text.subtle">Owned by the Design Systems team</Text>
						</Stack>
					</BenchmarkSurface>
				)}
			</Stack>
		</BenchmarkLayout>
	);
}
