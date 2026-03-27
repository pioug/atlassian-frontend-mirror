import React from 'react';

import { hydrateRoot } from 'react-dom/client';
import waitForExpect from 'wait-for-expect';

import { mockConsole, ssr } from '@atlaskit/ssr';

import Example from '../../../examples/2-time-range';

const getConsoleMockCalls = mockConsole(console);

afterEach(() => {
	jest.resetAllMocks();
});

// FIXME: Jes 29 upgrade - [React Intl] Could not find required `intl` object. <IntlProvider> needs to exist in the component ancestry.
test.skip('should ssr then hydrate media-ui correctly', async () => {
	const elem = document.createElement('div');
	elem.innerHTML = await ssr(Example);

	hydrateRoot(elem, <Example />);

	await waitForExpect(() => {
		const mockCalls = getConsoleMockCalls();
		expect(mockCalls.length).toBe(0);
	});
});
