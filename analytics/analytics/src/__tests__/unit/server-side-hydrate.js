import React from 'react';
import { createRoot } from 'react-dom/client';

import { ssr } from '@atlaskit/ssr';
import waitForExpect from 'wait-for-expect';

import Example from '../../../examples/01-basic-example';

jest.spyOn(global.console, 'error').mockImplementation(() => {});

afterEach(() => {
	jest.resetAllMocks();
});

test('should ssr then hydrate analytics correctly', async () => {
	const elem = document.createElement('div');
	elem.innerHTML = await ssr(Example);

	const root = createRoot(elem);
	root.render(<Example />);

	await waitForExpect(() => {
		// ignore warnings caused by emotion's server-side rendering approach
		// eslint-disable-next-line no-console
		const mockCalls = console.error.mock.calls.filter(
			([f, s]) =>
				!(
					f === 'Warning: Did not expect server HTML to contain a <%s> in <%s>.%s' && s === 'style'
				),
		);
		expect(mockCalls.length).toBe(0);
	});
});
