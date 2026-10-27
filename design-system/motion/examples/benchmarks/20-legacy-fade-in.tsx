import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import FadeIn from '@atlaskit/motion/fade-in';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

import { BenchmarkLayout, BenchmarkSurface } from './shared';

/**
 * Benchmark prompt:
 * Modernise this component's legacy `FadeIn` implementation using the recommended ADS Motion API.
 * Preserve its appearance, behavior, accessibility, and exit motion.
 */
export default function LegacyFadeInBenchmark(): JSX.Element {
	const [isVisible, setIsVisible] = useState(true);

	return (
		<BenchmarkLayout title="Legacy fade" description="Toggle the legacy animated message.">
			<Stack space="space.150">
				<Button onClick={() => setIsVisible((visible) => !visible)}>
					{isVisible ? 'Hide message' : 'Show message'}
				</Button>
				<ExitingPersistence appear>
					{isVisible && (
						<FadeIn key="message">
							{(motionProps) => (
								<div {...motionProps}>
									<BenchmarkSurface>
										<Stack space="space.050">
											<Text weight="semibold">Migration ready</Text>
											<Text color="color.text.subtle">
												This message currently uses a legacy entering-motion component.
											</Text>
										</Stack>
									</BenchmarkSurface>
								</div>
							)}
						</FadeIn>
					)}
				</ExitingPersistence>
			</Stack>
		</BenchmarkLayout>
	);
}
