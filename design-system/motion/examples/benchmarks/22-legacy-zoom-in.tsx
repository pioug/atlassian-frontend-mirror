import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import ZoomIn from '@atlaskit/motion/zoom-in';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

import { BenchmarkLayout, BenchmarkSurface } from './shared';

/**
 * Benchmark prompt:
 * Modernise this component's legacy `ZoomIn` implementation using the recommended ADS Motion API.
 * Preserve its scale-and-fade treatment, behavior, accessibility, and exit motion.
 */
export default function LegacyZoomInBenchmark(): JSX.Element {
	const [isVisible, setIsVisible] = useState(true);

	return (
		<BenchmarkLayout title="Legacy zoom" description="Toggle the legacy animated confirmation.">
			<Stack space="space.150">
				<Button onClick={() => setIsVisible((visible) => !visible)}>
					{isVisible ? 'Hide confirmation' : 'Show confirmation'}
				</Button>
				<ExitingPersistence appear>
					{isVisible && (
						<ZoomIn key="confirmation">
							{(motionProps) => (
								<div {...motionProps}>
									<BenchmarkSurface>
										<Stack space="space.050">
											<Text weight="semibold">Project created</Text>
											<Text color="color.text.subtle">
												This confirmation currently uses the legacy ZoomIn component.
											</Text>
										</Stack>
									</BenchmarkSurface>
								</div>
							)}
						</ZoomIn>
					)}
				</ExitingPersistence>
			</Stack>
		</BenchmarkLayout>
	);
}
