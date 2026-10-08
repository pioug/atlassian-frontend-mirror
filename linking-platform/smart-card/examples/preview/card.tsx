import React from 'react';

import Client from '@atlaskit/link-provider/client';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { Card } from '@atlaskit/smart-card/card/lazy';
class PreviewClient extends Client {
	fetchData(): ReturnType<Client['fetchData']> {
		return Promise.resolve<Awaited<ReturnType<Client['fetchData']>>>({
			meta: {
				visibility: 'public',
				access: 'granted',
				auth: [],
				definitionId: 'confluence-object-provider',
				key: 'confluence-object-provider',
			},
			data: {
				'@context': {
					'@vocab': 'https://www.w3.org/ns/activitystreams#',
					atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
					schema: 'http://schema.org/',
				},
				'@type': 'Document',
				name: 'Atlas roadmap',
				url: 'https://example.com/roadmap',
			},
		});
	}
}
const client = new PreviewClient('staging');
export default function Preview(): React.JSX.Element {
	return (
		<SmartCardProvider client={client}>
			<Card appearance="inline" url="https://example.com/roadmap" />
		</SmartCardProvider>
	);
}
export const previewOptions = {
	width: 'fit-content',
	scale: 1.8,
	readyText: 'Atlas roadmap',
} as const;
