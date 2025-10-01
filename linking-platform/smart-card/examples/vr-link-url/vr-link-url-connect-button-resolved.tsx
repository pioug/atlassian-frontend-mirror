import React from 'react';

import { type JsonLd } from '@atlaskit/json-ld-types';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';

import LinkUrl from '../../src/view/LinkUrl';
import VRTestWrapper from '../utils/vr-test-wrapper';

// Custom client that returns resolved state (should not show connect button)
class ResolvedClient extends CardClient {
	fetchData(url: string): Promise<JsonLd.Response> {
		return Promise.resolve({
			meta: {
				visibility: 'public',
				access: 'granted',
				auth: [],
				definitionId: 'google-object-provider',
				key: 'google-object-provider',
			},
			data: {
				'@context': {
					'@vocab': 'https://www.w3.org/ns/activitystreams#',
					atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
					schema: 'http://schema.org/',
				},
				'@type': 'Object',
				url: url,
				name: 'Google',
			},
		} as JsonLd.Response);
	}
}

export default () => (
	<VRTestWrapper>
		<SmartCardProvider client={new ResolvedClient()}>
			<LinkUrl enableResolve={true} href="https://www.google.com/">
				Google
			</LinkUrl>
		</SmartCardProvider>
	</VRTestWrapper>
);
