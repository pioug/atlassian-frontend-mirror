import React from 'react';

import Client from '@atlaskit/link-provider/client';
import { SmartCardProvider as Provider } from '@atlaskit/link-provider/smart-card-provider';
import type { CardProviderStoreOpts } from '@atlaskit/link-provider/types';

import { CardSSR } from '../../src/ssr';
import { cardState, url } from '../utils/smart-card-ssr-state';

const storeOptions: CardProviderStoreOpts = {
	initialState: {
		[url]: cardState,
	},
};

export default (): React.JSX.Element => (
	<Provider storeOptions={storeOptions} client={new Client('stg')}>
		<CardSSR appearance="inline" url={url} />
	</Provider>
);
