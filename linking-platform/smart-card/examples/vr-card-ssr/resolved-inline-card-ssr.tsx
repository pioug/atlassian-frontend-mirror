import React from 'react';

import {
	type CardProviderStoreOpts,
	CardClient as Client,
	SmartCardProvider as Provider,
} from '@atlaskit/link-provider';

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
