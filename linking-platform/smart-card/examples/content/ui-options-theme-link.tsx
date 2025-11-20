import React from 'react';

import { type JsonLd } from '@atlaskit/json-ld-types';
import { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { response1 } from '@atlaskit/link-test-helpers';

import { Card, SmartLinkTheme, TitleBlock } from '../../src';

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(response1 as JsonLd.Response);
	}
}

export default (): React.JSX.Element => (
	<Provider client={new CustomClient('stg')}>
		<Card appearance="inline" ui={{ theme: SmartLinkTheme.Link }} url={response1.data.url}>
			<TitleBlock />
		</Card>
	</Provider>
);
