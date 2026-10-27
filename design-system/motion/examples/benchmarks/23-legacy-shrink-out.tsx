import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import ShrinkOut from '@atlaskit/motion/shrink-out';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

import { BenchmarkLayout, BenchmarkSurface } from './shared';

const initialApps = ['Confluence', 'Jira', 'Bitbucket'];

/**
 * Benchmark prompt:
 * Modernise this list's legacy `ShrinkOut` implementation using the recommended ADS Motion APIs.
 * Preserve the space-closing exit, list behavior, accessibility, and reduced-motion support.
 */
export default function LegacyShrinkOutBenchmark(): JSX.Element {
	const [apps, setApps] = useState(initialApps);

	return (
		<BenchmarkLayout title="Legacy shrink" description="Remove and restore connected apps.">
			<Stack space="space.150">
				<Inline space="space.100" shouldWrap>
					<ExitingPersistence>
						{apps.map((app) => (
							<ShrinkOut key={app}>
								{({ ref }) => (
									<div ref={ref}>
										<BenchmarkSurface>
											<Stack space="space.100">
												<Text weight="semibold">{app}</Text>
												<Button
													onClick={() => setApps((items) => items.filter((item) => item !== app))}
												>
													Remove
												</Button>
											</Stack>
										</BenchmarkSurface>
									</div>
								)}
							</ShrinkOut>
						))}
					</ExitingPersistence>
				</Inline>
				<Button
					onClick={() => setApps(initialApps)}
					isDisabled={apps.length === initialApps.length}
				>
					Restore apps
				</Button>
			</Stack>
		</BenchmarkLayout>
	);
}
