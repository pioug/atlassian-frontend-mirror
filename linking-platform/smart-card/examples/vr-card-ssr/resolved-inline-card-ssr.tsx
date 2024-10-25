import React from 'react';

import { type CardProviderStoreOpts } from '@atlaskit/link-provider';

import { Client, Provider } from '../../src';
import { CardSSR } from '../../src/ssr';
import { cardState, url } from '../utils/smart-card-ssr-state';

const storeOptions: CardProviderStoreOpts = {
	initialState: {
		[url]: cardState,
	},
};

export default () => (
	<Provider storeOptions={storeOptions} client={new Client('stg')}>
		<CardSSR appearance="inline" url={url} />
	</Provider>
);
