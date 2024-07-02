import React, { useEffect } from 'react';
import { Stack, xcss } from '@atlaskit/primitives';
import { AnalyticsContext, useAnalyticsEvents } from '@atlaskit/analytics-next';

import { type ResolvedResultsStackProps } from './types';
import RelatedUrlItem from '../related-url-item';
import { RelatedUrlItemAnalyticsContext, fireRelatedLinksViewedEvent } from './analytics';

const ResolvedResultsStack: React.FC<ResolvedResultsStackProps> = ({
	resolvedResults,
	testId,
	renderers,
}) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();

	useEffect(() => {
		// This event will fire each time the component is loaded
		fireRelatedLinksViewedEvent(createAnalyticsEvent)({
			relatedLinksCount: resolvedResults.length,
		});
	}, [resolvedResults.length, createAnalyticsEvent]);

	return (
		<Stack
			space="space.050"
			testId={`${testId}-items-wrapper`}
			as="ul"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			xcss={xcss({ paddingLeft: 'space.0', marginTop: 'space.0' })}
		>
			{resolvedResults.map((resolvedResults, idx) => (
				<RelatedUrlItemAnalyticsContext details={resolvedResults} key={idx}>
					<RelatedUrlItem
						testId={`${testId}-item`}
						results={resolvedResults}
						renderers={renderers}
					/>
				</RelatedUrlItemAnalyticsContext>
			))}
		</Stack>
	);
};

const ResolvedResultsStackWithAnalytics = (props: ResolvedResultsStackProps) => {
	return (
		<AnalyticsContext data={{ component: 'relatedLinksSection' }}>
			<ResolvedResultsStack {...props} />
		</AnalyticsContext>
	);
};

export default ResolvedResultsStackWithAnalytics;
