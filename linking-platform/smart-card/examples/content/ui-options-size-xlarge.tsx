import React from 'react';

import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import Client from '@atlaskit/link-provider/client';
import { SmartCardProvider as Provider } from '@atlaskit/link-provider/smart-card-provider';
import { response1 } from '@atlaskit/link-test-helpers';

import { Card, SmartLinkSize, TitleBlock } from '../../src';

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(response1 as JsonLd.Response);
	}
}

export default (): React.JSX.Element => (
	<Provider client={new CustomClient('stg')}>
		<Card appearance="inline" ui={{ size: SmartLinkSize.XLarge }} url={response1.data.url}>
			<TitleBlock />
		</Card>
	</Provider>
);
