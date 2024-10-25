import React from 'react';

import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';

import { type AnalyticsFacade } from '../../src/state/analytics/useSmartLinkAnalytics';
import FlexibleResolvedView from '../../src/view/BlockCard/views/flexible/FlexibleResolvedView';
import { minimumResponse, unicornResponse } from '../content/example-responses';
import { getJsonLdResponse } from '../utils/flexible-ui';
import { renderCard } from '../utils/vr-block-flexible-views';
import { VRTestWrapper } from '../utils/vr-test';

class MinimumResolvedCustomClient extends CardClient {
	fetchData(url: string) {
		return Promise.resolve(getJsonLdResponse(url, minimumResponse.meta, minimumResponse.data));
	}
}

class MaximumResolvedCustomClient extends CardClient {
	fetchData(url: string) {
		return Promise.resolve(getJsonLdResponse(url, unicornResponse.meta, unicornResponse.data));
	}
}

export default () => {
	const mockAnalytics = {} as AnalyticsFacade;

	return (
		<VRTestWrapper title="Block card Flexible views">
			<h4>Resolved (minimal data)</h4>
			{renderCard(new MinimumResolvedCustomClient(), 'block')}

			<h4>Resolved (maximum data)</h4>
			{renderCard(new MaximumResolvedCustomClient(), 'block')}

			<h4>Resolving</h4>
			<SmartCardProvider>
				<FlexibleResolvedView
					cardState={{ status: 'resolving' }}
					url="some-url"
					analytics={mockAnalytics}
				/>
			</SmartCardProvider>
		</VRTestWrapper>
	);
};
