import React from 'react';

import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import Client from '@atlaskit/link-provider/client';
import { SmartCardProvider as Provider } from '@atlaskit/link-provider/smart-card-provider';
import { url } from '@atlaskit/link-test-helpers';

import { Card, TitleBlock } from '../../src';

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve({
			meta: {
				visibility: 'not_found',
				access: 'forbidden',
			},
			data: {},
		} as JsonLd.Response);
	}
}

export default (): React.JSX.Element => (
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
