import React from 'react';

import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { JiraIssue } from '@atlaskit/link-test-helpers';

import { Card } from '../../src';
import { getJsonLdResponse } from '../utils/flexible-ui';
import VRTestWrapper from '../utils/vr-test-wrapper';

class CustomClient extends CardClient {
	fetchData(url: string) {
		return Promise.resolve(getJsonLdResponse(url, JiraIssue.meta, JiraIssue.data));
	}
}

export default (): React.JSX.Element => (
	<VRTestWrapper>
		<SmartCardProvider client={new CustomClient()} isAdminHubAIEnabled={true} product="JSM">
			<Card
				appearance="inline"
				url="https://product-fabric.atlassian.net/wiki/spaces/EM"
				showHoverPreview={true}
			/>
		</SmartCardProvider>
	</VRTestWrapper>
);
