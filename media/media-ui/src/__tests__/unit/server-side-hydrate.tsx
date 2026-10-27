import React, { act } from 'react';

import { hydrateRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';

import { mockConsole, ssr } from '@atlaskit/ssr';
import { waitFor } from '@atlassian/testing-library/wait-for';

import Example from '../../../examples/2-time-range';

const getConsoleMockCalls = mockConsole(console);

let root: ReturnType<typeof hydrateRoot> | undefined;

afterEach(async () => {
	await act(async () => root?.unmount());
	root = undefined;
	jest.resetAllMocks();
});

const ExampleWithIntl = () => (
	<IntlProvider locale="en">
		<Example />
	</IntlProvider>
);

test('should ssr then hydrate media-ui correctly', async () => {
	const elem = document.createElement('div');
	elem.innerHTML = await ssr(ExampleWithIntl);

	await act(async () => {
		root = hydrateRoot(elem, <ExampleWithIntl />);
	});
	await waitFor(() => {
		const mockCalls = getConsoleMockCalls();
		expect(mockCalls.length).toBe(0);
	});
});
