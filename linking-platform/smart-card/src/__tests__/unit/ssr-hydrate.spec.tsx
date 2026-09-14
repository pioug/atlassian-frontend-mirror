import React from 'react';

import { hydrateRoot } from 'react-dom/client';

import type { CardProviderStoreOpts } from '@atlaskit/link-provider/types';
import Client from '@atlaskit/link-provider/client';
import { SmartCardProvider as Provider } from '@atlaskit/link-provider/smart-card-provider';
import { ssr } from '@atlaskit/ssr';

import { cardState, url } from '../../../examples/utils/smart-card-ssr-state';
import { TitleBlock } from '../../index';
import { CardSSR } from '../../ssr';

jest.spyOn(global.console, 'error').mockImplementation(() => {});

const storeOptions: CardProviderStoreOpts = {
	initialState: {
		[url]: cardState,
	},
};

const Example = () => (
	<Provider storeOptions={storeOptions} client={new Client('stg')}>
		<CardSSR appearance="inline" url={url} />
		<CardSSR
			appearance="block"
			url={url}
			title="ssr-layered-link-title"
			ui={{ clickableContainer: true }}
		>
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

	hydrateRoot(elem, <Example />);

	expect(elem.innerHTML).toContain('inline-card-resolved-view');
	expect(elem.innerHTML).toContain('smart-block-title-resolved-view');
	expect(elem.innerHTML).toContain('smart-links-container-layered-link');
	expect(elem.innerHTML).toContain('ssr-layered-link-title');
});
