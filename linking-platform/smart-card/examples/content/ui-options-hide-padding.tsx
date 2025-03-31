import React from 'react';

import { type JsonLd } from '@atlaskit/json-ld-types';
import { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';

import { Card, TitleBlock } from '../../src';

import { response1 } from './example-responses';

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(response1 as JsonLd.Response);
	}
}

export default () => (
	<Provider client={new CustomClient('stg')}>
		<Card appearance="inline" ui={{ hidePadding: true }} url={response1.data.url}>
			<TitleBlock />
		</Card>
	</Provider>
);
