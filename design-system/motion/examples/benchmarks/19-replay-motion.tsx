import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

import { BenchmarkLayout, BenchmarkSurface } from './shared';

/**
 * Benchmark prompt:
 * Add controls that replay this status indicator's motion without unmounting it. It should be
 * possible to play entry, exit, and exit-then-entry sequences.
 */
export default function ReplayMotionBenchmark(): JSX.Element {
	const [lastAction, setLastAction] = useState('No sequence selected');

	return (
		<BenchmarkLayout
			title="Replay motion"
			description="The status indicator always remains mounted."
		>
			<Stack space="space.150">
				<Inline space="space.100" shouldWrap>
					<Button onClick={() => setLastAction('Entry selected')}>Play entry</Button>
					<Button onClick={() => setLastAction('Exit selected')}>Play exit</Button>
					<Button onClick={() => setLastAction('Exit then entry selected')}>
						Play exit then entry
					</Button>
				</Inline>
				<BenchmarkSurface>
					<Stack space="space.050">
						<Text weight="semibold">Changes saved</Text>
						<Text color="color.text.subtle">{lastAction}</Text>
					</Stack>
				</BenchmarkSurface>
			</Stack>
		</BenchmarkLayout>
	);
}
