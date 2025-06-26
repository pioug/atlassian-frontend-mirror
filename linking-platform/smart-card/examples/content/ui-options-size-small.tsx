import React from 'react';

import { type JsonLd } from '@atlaskit/json-ld-types';
import { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { response1 } from '@atlaskit/link-test-helpers';

import { Card, SmartLinkSize, TitleBlock } from '../../src';

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(response1 as JsonLd.Response);
	}
}

export default () => (
	<Provider client={new CustomClient('stg')}>
		<Card appearance="inline" ui={{ size: SmartLinkSize.Small }} url={response1.data.url}>
			<TitleBlock />
		</Card>
	</Provider>
);
