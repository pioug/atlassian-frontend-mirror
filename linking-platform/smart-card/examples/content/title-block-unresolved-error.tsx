import React from 'react';

import Client from '@atlaskit/link-provider/client';
import { SmartCardProvider as Provider } from '@atlaskit/link-provider/smart-card-provider';
import { url } from '@atlaskit/link-test-helpers';

import { Card, TitleBlock } from '../../src';

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
