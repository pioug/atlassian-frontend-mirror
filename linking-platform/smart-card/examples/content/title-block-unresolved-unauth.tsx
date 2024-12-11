import React from 'react';

import { type JsonLd } from 'json-ld-types';

import { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';

import { Card, TitleBlock } from '../../src';

import { url } from './example-responses';

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve({
			meta: {
				visibility: 'restricted',
				access: 'unauthorized',
				auth: [
					{
						key: 'some-flow',
						displayName: 'Flow',
						url: 'https://outbound-auth/flow',
					},
				],
			},
			data: {
				generator: {
					'@type': 'Object',
					'@id': 'confluence-object-provider',
					name: 'Confluence',
				},
			},
		} as JsonLd.Response);
	}
}

export default () => (
	<Provider client={new CustomClient('stg')}>
		<Card
			appearance="inline"
			ui={{ hideBackground: true, hideElevation: true, hidePadding: true }}
			url={url}
		>
			<TitleBlock />
		</Card>
	</Provider>
);
