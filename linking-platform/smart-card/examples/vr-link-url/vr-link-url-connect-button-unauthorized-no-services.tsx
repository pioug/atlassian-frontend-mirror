import React from 'react';

import { type JsonLd } from '@atlaskit/json-ld-types';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';

import LinkUrl from '../../src/view/LinkUrl';
import VRTestWrapper from '../utils/vr-test-wrapper';

// Custom client that returns unauthorized state with NO services available
class UnauthorizedClientNoServices extends CardClient {
	fetchData(url: string): Promise<JsonLd.Response> {
		return Promise.resolve({
			meta: {
				visibility: 'restricted',
				access: 'unauthorized',
				auth: [], // Empty auth array means no services available
				definitionId: 'external-service-provider',
				key: 'external-service-provider',
			},
			data: {
				'@context': {
					'@vocab': 'https://www.w3.org/ns/activitystreams#',
					atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
					schema: 'http://schema.org/',
				},
				'@type': 'Object',
				url: url,
				name: 'External Service Document',
			},
		} as JsonLd.Response);
	}
}

export default (): React.JSX.Element => (
	<VRTestWrapper>
		<SmartCardProvider client={new UnauthorizedClientNoServices()}>
			<LinkUrl enableResolve={true} href="https://www.external-service.com/document">
				External Service Document
			</LinkUrl>
		</SmartCardProvider>
	</VRTestWrapper>
);
