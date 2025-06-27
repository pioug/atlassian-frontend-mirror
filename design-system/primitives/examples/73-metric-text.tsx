import React from 'react';

import Heading from '@atlaskit/heading';
import { MetricText, Stack } from '@atlaskit/primitives';

const sizes = ['small', 'medium', 'large'] as const;
const alignments = ['start', 'center', 'end'] as const;

export default () => {
	return (
		<Stack space="space.300">
			<section>
				<Stack space="space.100">
					<Heading size="medium" as="h3">
						Sizes
					</Heading>
					{sizes.map((size) => (
						<MetricText key={size} size={size}>
							size: {size}
						</MetricText>
					))}
				</Stack>
			</section>
			<section>
				<Stack space="space.100">
					<Heading size="medium" as="h3">
						Alignment
					</Heading>
					{alignments.map((alignment) => (
						<MetricText key={alignment} size="small" align={alignment}>
							alignment: {alignment}
						</MetricText>
					))}
				</Stack>
			</section>
			<section>
				<Stack space="space.100">
					<Heading size="medium" as="h3">
						Rendered element
					</Heading>
					<MetricText size="small" as="span">
						MetricText as span tag
					</MetricText>
					<MetricText size="small" as="div">
						MetricText as div tag
					</MetricText>
					<MetricText size="small">MetricText is rendered as a {'<span>'} by default</MetricText>
				</Stack>
			</section>
		</Stack>
	);
};
