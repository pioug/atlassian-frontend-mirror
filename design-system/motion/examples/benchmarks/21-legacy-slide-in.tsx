import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import SlideIn from '@atlaskit/motion/slide-in';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

import { BenchmarkLayout, BenchmarkSurface } from './shared';

/**
 * Benchmark prompt:
 * Modernise this component's legacy `SlideIn` implementation using the recommended ADS Motion API.
 * Preserve its directional entry and exit, behavior, accessibility, and reduced-motion support.
 */
export default function LegacySlideInBenchmark(): JSX.Element {
	const [isVisible, setIsVisible] = useState(true);

	return (
		<BenchmarkLayout title="Legacy slide" description="Toggle the legacy sliding side panel.">
			<Stack space="space.150">
				<Button onClick={() => setIsVisible((visible) => !visible)}>
					{isVisible ? 'Hide panel' : 'Show panel'}
				</Button>
				<ExitingPersistence appear>
					{isVisible && (
						<SlideIn key="panel" enterFrom="right">
							{(motionProps) => (
								<div {...motionProps}>
									<BenchmarkSurface>
										<Stack space="space.050">
											<Text weight="semibold">Project details</Text>
											<Text color="color.text.subtle">
												This panel currently uses the legacy SlideIn component.
											</Text>
										</Stack>
									</BenchmarkSurface>
								</div>
							)}
						</SlideIn>
					)}
				</ExitingPersistence>
			</Stack>
		</BenchmarkLayout>
	);
}
