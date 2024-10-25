import React, { useState } from 'react';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { Code } from '@atlaskit/code';
import Heading from '@atlaskit/heading';
import Stack from '@atlaskit/primitives/stack';

import Pagination from '../src';

export default function AnalyticsExample() {
	const [analyticEventContext, setAnalyticEventContext] = useState({});
	const [analyticEventPayload, setAnalyticEventPayload] = useState({});

	const sendAnalytics = (analyticEvent: { context: any; payload: any }) => {
		setAnalyticEventContext(analyticEvent.context);
		setAnalyticEventPayload(analyticEvent.payload);
	};

	return (
		<AnalyticsListener channel="atlaskit" onEvent={sendAnalytics}>
			<Stack space="space.500">
				<Pagination
					testId="pagination"
					getPageLabel={(page: any) => (typeof page === 'object' ? page.value : page)}
					pages={pageLinks}
					nextLabel="Next"
					label="Analytics Page"
					pageLabel="Page"
					previousLabel="Previous"
				/>
				<Stack space="space.150">
					<Heading size="large">Analytics event context received</Heading>
					<Code>{JSON.stringify(analyticEventContext, null, 2)}</Code>
				</Stack>
				<Stack space="space.150">
					<Heading size="large">Analytics event payload received</Heading>
					<Code>{JSON.stringify(analyticEventPayload, null, 2)}</Code>
				</Stack>
			</Stack>
		</AnalyticsListener>
	);
}

const pageLinks: Array<{ value: number }> = [...Array(13)].map((_, index) => ({
	value: index + 1,
}));
