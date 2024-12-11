import React from 'react';

import { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';

import { Card, TitleBlock } from '../../src';

import { url } from './example-responses';

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.reject({
			error: {
				type: 'ResolveUnsupportedError',
				message: 'URL not supported',
				status: 404,
			},
			status: 404,
		});
	}
}

export default () => (
	<Provider client={new CustomClient('stg')}>
		<Card
			appearance="inline"
			ui={{ hideBackground: true, hideElevation: true, hidePadding: true }}
			url={url}
		>
			<TitleBlock hideIcon={true} />
		</Card>
	</Provider>
);
