import React from 'react';

import { CardClient, SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { JiraIssue } from '@atlaskit/link-test-helpers';

import { Card, SnippetBlock, TitleBlock } from '../../src';
import { getJsonLdResponse } from '../utils/flexible-ui';
import VRTestWrapper from '../utils/vr-test-wrapper';

class MaximumResolvedCustomClient extends CardClient {
	fetchData(url: string) {
		return Promise.resolve(getJsonLdResponse(url, JiraIssue.meta, JiraIssue.data));
	}
}

export default () => (
	<VRTestWrapper>
		<Provider client={new MaximumResolvedCustomClient()}>
			<Card
				appearance="block"
				url={'https://product-fabric.atlassian.net/wiki/spaces/EM'}
				showHoverPreview={true}
				actionOptions={{ hide: true }}
			>
				<TitleBlock hideTitleTooltip={true} />
				<SnippetBlock />
			</Card>
		</Provider>
	</VRTestWrapper>
);
