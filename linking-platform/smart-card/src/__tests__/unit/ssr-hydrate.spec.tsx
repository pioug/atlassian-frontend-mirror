import type { CardProviderStoreOpts } from '@atlaskit/link-provider';
import { ssr } from '@atlaskit/ssr';
import React from 'react';

import ReactDOM from 'react-dom';
import { Client, Provider, TitleBlock } from '../..';

import { cardState, url } from '../../../examples/utils/smart-card-ssr-state';
import { CardSSR } from '../../ssr';

// @ts-ignore
jest.spyOn(global.console, 'error').mockImplementation(() => {});

const storeOptions: CardProviderStoreOpts = {
	initialState: {
		[url]: cardState,
	},
};

const Example = () => (
	<Provider storeOptions={storeOptions} client={new Client('stg')}>
		<CardSSR appearance="inline" url={url} />
		<CardSSR appearance="block" url={url}>
			<TitleBlock />
		</CardSSR>
	</Provider>
);

afterEach(() => {
	jest.resetAllMocks();
});

test('should ssr then hydrate example component correctly', async () => {
	const elem = document.createElement('div');
	elem.innerHTML = await ssr(Example);

	ReactDOM.hydrate(<Example />, elem);

	expect(elem.innerHTML).toContain('inline-card-resolved-view');
	expect(elem.innerHTML).toContain('smart-block-title-resolved-view');
});
