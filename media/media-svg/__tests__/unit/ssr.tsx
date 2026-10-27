import React, { act } from 'react';

import { waitFor } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';

import { ssr } from '@atlaskit/ssr';

import Example from '../../examples/00-basic';

jest.spyOn(global.console, 'error').mockImplementation(() => {});

let root: ReturnType<typeof hydrateRoot> | undefined;

afterEach(async () => {
	await act(async () => root?.unmount());
	root = undefined;
	jest.resetAllMocks();
});

test('should ssr then hydrate example component correctly', async () => {
	const elem = document.createElement('div');
	elem.innerHTML = await ssr(Example);

	await act(async () => {
		root = hydrateRoot(elem, <Example />);
	});
	await waitFor(() => {
		// Ignore Emotion style-tag warnings and React 18 server layout-effect warnings.
		// @ts-ignore
		// eslint-disable-next-line no-console
		const mockCalls = console.error.mock.calls.filter(
			([f, s]: string[]) =>
				!(
					typeof f === 'string' &&
					f.startsWith('Warning: useLayoutEffect does nothing on the server,')
				) &&
				!(
					f === 'Warning: Did not expect server HTML to contain a <%s> in <%s>.%s' && s === 'style'
				),
		);
		expect(mockCalls.length).toBe(0);
	});
});
